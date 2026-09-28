/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header, ActiveTab } from './components/Header';
import { VisualizerCanvas } from './components/VisualizerCanvas';
import { CppCodeViewer } from './components/CppCodeViewer';
import { PlaybackControls } from './components/PlaybackControls';
import { VariableWatch } from './components/VariableWatch';
import { ListSelector } from './components/ListSelector';
import { ListManagerModal } from './components/ListManagerModal';
import { MultiListLab } from './components/MultiListLab';
import { CompareView } from './components/CompareView';
import { AlgorithmGuide } from './components/AlgorithmGuide';
import { InstructorVoiceBar } from './components/InstructorVoiceBar';
import { ALGORITHMS, ALGORITHM_LIST, DEFAULT_LIST_PRESETS } from './algorithms';
import { AlgorithmId, NumberListPreset } from './types/sorting';
import { soundManager } from './services/soundEffects';
import { instructorVoice } from './services/instructorVoice';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('debugger');
  const [selectedAlgoId, setSelectedAlgoId] = useState<AlgorithmId>('bubble');
  const [numberLists, setNumberLists] = useState<NumberListPreset[]>(DEFAULT_LIST_PRESETS);
  const [activeListId, setActiveListId] = useState<string>(DEFAULT_LIST_PRESETS[0].id);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isLectureMode, setIsLectureMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Current active list and algorithm
  const activeList = useMemo(() => {
    return numberLists.find((l) => l.id === activeListId) || numberLists[0];
  }, [numberLists, activeListId]);

  const activeAlgorithm = useMemo(() => {
    return ALGORITHMS[selectedAlgoId];
  }, [selectedAlgoId]);

  // Compute steps
  const steps = useMemo(() => {
    return activeAlgorithm.generateSteps(activeList.data);
  }, [activeAlgorithm, activeList]);

  // Reset step index whenever algorithm or list changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsLectureMode(false);
    instructorVoice.stop();
  }, [selectedAlgoId, activeListId]);

  // Subscribe to speech state
  useEffect(() => {
    const unsub = instructorVoice.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  // Current step snapshot
  const currentStep = steps[currentStepIndex] || steps[0];

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setIsLectureMode(false);
    instructorVoice.stop();
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setIsLectureMode(false);
    instructorVoice.stop();
    setCurrentStepIndex(0);
  }, []);

  const handleJumpToEnd = useCallback(() => {
    setIsPlaying(false);
    setIsLectureMode(false);
    instructorVoice.stop();
    setCurrentStepIndex(steps.length - 1);
  }, [steps.length]);

  const handleScrub = useCallback((newIndex: number) => {
    setIsPlaying(false);
    setIsLectureMode(false);
    instructorVoice.stop();
    setCurrentStepIndex(newIndex);
  }, []);

  // Lecture Mode Auto-Advance callback
  const handleLectureAdvance = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      } else {
        setIsLectureMode(false);
        return prev;
      }
    });
  }, [steps.length]);

  // Sound & Speech triggering effect
  useEffect(() => {
    if (!currentStep) return;
    const maxVal = Math.max(...currentStep.array, 100);

    // Audio sonification chimes
    if (currentStep.action === 'compare') {
      const compIndices = Object.entries(currentStep.statusMap)
        .filter(([_, status]) => status === 'comparing')
        .map(([idx]) => Number(idx));

      if (compIndices.length >= 2) {
        soundManager.playCompare(
          currentStep.array[compIndices[0]],
          currentStep.array[compIndices[1]],
          maxVal
        );
      } else if (compIndices.length === 1) {
        soundManager.playCompare(currentStep.array[compIndices[0]], undefined, maxVal);
      } else {
        soundManager.playCompare(45, undefined, maxVal);
      }
    } else if (currentStep.action === 'swap') {
      const swapIndices = Object.entries(currentStep.statusMap)
        .filter(([_, status]) => status === 'swapping')
        .map(([idx]) => Number(idx));

      if (swapIndices.length >= 2) {
        soundManager.playSwap(
          currentStep.array[swapIndices[0]],
          currentStep.array[swapIndices[1]],
          maxVal
        );
      } else {
        soundManager.playSwap(40, 70, maxVal);
      }
    } else if (currentStep.action === 'shift' || currentStep.action === 'assign') {
      const activeIdx = Object.entries(currentStep.statusMap).find(
        ([_, status]) => status === 'overwriting' || status === 'swapping'
      );
      const val = activeIdx ? currentStep.array[Number(activeIdx[0])] : 50;
      soundManager.playTone(val * 7 + 220, 70);
    } else if (currentStep.action === 'partition') {
      soundManager.playSorted(65, maxVal);
    } else if (currentStep.action === 'done') {
      soundManager.playCompletionSweep(currentStep.array);
    }

    // Instructor Voice Explanation
    if (instructorVoice.isVoiceEnabled()) {
      instructorVoice.explainStep(
        currentStep.title,
        currentStep.explanation,
        currentStep.action,
        isLectureMode ? handleLectureAdvance : undefined
      );
    }
  }, [currentStepIndex, currentStep, isLectureMode, handleLectureAdvance]);

  // Standard animation playback loop (when not in lecture mode)
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(80, Math.round(550 / speed));
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  const handleTogglePlay = useCallback(() => {
    if (isLectureMode) {
      setIsLectureMode(false);
      instructorVoice.stop();
    }
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStepIndex, steps.length, isLectureMode]);

  const handleToggleLectureMode = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    const nextMode = !isLectureMode;
    setIsLectureMode(nextMode);
    if (nextMode) {
      instructorVoice.setEnabled(true);
      instructorVoice.explainStep(
        currentStep.title,
        currentStep.explanation,
        currentStep.action,
        handleLectureAdvance
      );
    } else {
      instructorVoice.stop();
    }
  }, [isPlaying, isLectureMode, currentStep, handleLectureAdvance]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBack();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleStepForward, handleStepBack, handleReset]);

  // List management helpers
  const handleAddList = (newList: NumberListPreset) => {
    setNumberLists((prev) => [newList, ...prev]);
  };

  const handleDeleteList = (id: string) => {
    setNumberLists((prev) => prev.filter((l) => l.id !== id));
    if (activeListId === id) {
      setActiveListId(numberLists[0].id);
    }
  };

  const handleSelectAndDebugList = (listId: string) => {
    setActiveListId(listId);
    setActiveTab('debugger');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenListManager={() => setIsListModalOpen(true)}
        listCount={numberLists.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Step Debugger View */}
        {activeTab === 'debugger' && (
          <div className="flex flex-col gap-5">
            {/* Algorithm Selector Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
                  Algorithm:
                </span>
                {ALGORITHM_LIST.map((algo) => {
                  const isSelected = algo.id === selectedAlgoId;
                  return (
                    <button
                      key={algo.id}
                      onClick={() => setSelectedAlgoId(algo.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700'
                      }`}
                    >
                      {algo.name}
                    </button>
                  );
                })}
              </div>

              {/* Complexity badge for quick reference */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-slate-500">Average:</span>
                <span className="text-amber-300 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {activeAlgorithm.complexity.average}
                </span>
                <span className="text-slate-500">Space:</span>
                <span className="text-emerald-300 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {activeAlgorithm.complexity.space}
                </span>
              </div>
            </div>

            {/* Active List Selector */}
            <ListSelector
              lists={numberLists}
              activeListId={activeListId}
              onSelectList={setActiveListId}
              onOpenModal={() => setIsListModalOpen(true)}
            />

            {/* Two-Zone Layout: Left Visualizer Stage + Playback; Right C++ Code & Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Zone: Visualizer Canvas + Playback Controls (7 cols on lg) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Voice Instructor Bar */}
                <InstructorVoiceBar
                  currentTitle={currentStep.title}
                  currentExplanation={currentStep.explanation}
                  currentAction={currentStep.action}
                  onAutoAdvanceStep={handleLectureAdvance}
                  isLectureMode={isLectureMode}
                  onToggleLectureMode={handleToggleLectureMode}
                />

                <VisualizerCanvas
                  currentStep={currentStep}
                  algorithmName={activeAlgorithm.name}
                  onSpeakExplanation={() =>
                    instructorVoice.explainStep(
                      currentStep.title,
                      currentStep.explanation,
                      currentStep.action
                    )
                  }
                  isSpeaking={isSpeaking}
                />

                <PlaybackControls
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onStepForward={handleStepForward}
                  onStepBack={handleStepBack}
                  onReset={handleReset}
                  onJumpToEnd={handleJumpToEnd}
                  currentStepIndex={currentStepIndex}
                  totalSteps={steps.length}
                  onScrub={handleScrub}
                  speed={speed}
                  onSpeedChange={setSpeed}
                />

                {/* Keyboard shortcut hint banner */}
                <div className="text-[11px] text-slate-500 font-mono text-center flex items-center justify-center gap-3">
                  <span>Shortcuts:</span>
                  <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">Space</kbd> Play/Pause</span>
                  <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">→</kbd> Next Step</span>
                  <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">←</kbd> Prev Step</span>
                  <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">R</kbd> Reset</span>
                </div>
              </div>

              {/* Right Zone: C++ Code Viewer & Memory Inspector (5 cols on lg) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="h-[360px]">
                  <CppCodeViewer
                    codeLines={activeAlgorithm.cppCode}
                    activeLine={currentStep.line}
                    algorithmName={activeAlgorithm.name.replace(/\s+/g, '')}
                  />
                </div>

                <VariableWatch
                  variables={currentStep.variables}
                  callStack={currentStep.callStack}
                  comparisons={currentStep.comparisons}
                  swaps={currentStep.swaps}
                  complexity={activeAlgorithm.complexity}
                />
              </div>
            </div>
          </div>
        )}

        {/* Multi-List Test Suite Lab View */}
        {activeTab === 'batch' && (
          <MultiListLab
            lists={numberLists}
            algorithm={activeAlgorithm}
            onSelectAndDebugList={handleSelectAndDebugList}
            onOpenListManager={() => setIsListModalOpen(true)}
          />
        )}

        {/* Algorithm Comparison View */}
        {activeTab === 'compare' && (
          <CompareView currentList={activeList} />
        )}

        {/* Comprehensive C++ Guide View */}
        {activeTab === 'guide' && <AlgorithmGuide />}
      </main>

      {/* List of Lists Manager Modal */}
      <ListManagerModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        lists={numberLists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onAddList={handleAddList}
        onDeleteList={handleDeleteList}
      />
    </div>
  );
}

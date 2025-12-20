import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../Context_holder'
import { Link } from 'react-router-dom'

export default function MatchstickPuzzleList() {
  const { MatchistickPuzzleFetch,AllMatchistickPuzzles,MatchistickPuzzleScore,MatchistickPuzzleScoreFetch }=useContext(Context)

  const [completedLevels, setCompletedLevels] = useState(new Set())

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    MatchistickPuzzleFetch()
    MatchistickPuzzleScoreFetch()

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (MatchistickPuzzleScore && AllMatchistickPuzzles) {
      const completed = new Set()
      MatchistickPuzzleScore.forEach(score => {
        if (score.score === 1) {
          completed.add(score.MatchstickMathPuzzle_id.toString())
        }
      })
      setCompletedLevels(completed)
    }
  }, [MatchistickPuzzleScore, AllMatchistickPuzzles])

  const getLevelStatus = (puzzleId) => {
    return completedLevels.has(puzzleId.toString()) ? 'completed' : 'locked'
  }

  // Dynamic sizing based on screen width
  const getGridConfig = () => {
    if (windowSize.width < 640) return { cols: 4, gap: 3, cardSize: '4rem' }
    if (windowSize.width < 768) return { cols: 5, gap: 4, cardSize: '4.5rem' }
    if (windowSize.width < 1024) return { cols: 6, gap: 5, cardSize: '5rem' }
    if (windowSize.width < 1280) return { cols: 8, gap: 6, cardSize: '5.5rem' }
    return { cols: 10, gap: 6, cardSize: '6rem' }
  }

  const getFontSize = () => {
    if (windowSize.width < 640) return 'text-lg'
    if (windowSize.width < 768) return 'text-xl'
    if (windowSize.width < 1024) return 'text-2xl'
    return 'text-2xl'
  }

  const getHeaderSize = () => {
    if (windowSize.width < 640) return 'text-3xl'
    if (windowSize.width < 768) return 'text-4xl'
    return 'text-6xl'
  }

  const gridConfig = getGridConfig()
  const fontSize = getFontSize()
  const headerSize = getHeaderSize()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 pt-4 sm:pt-8">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-0.5 rounded-2xl sm:rounded-3xl">
              <div className="bg-slate-900 rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-6">
                <h1 className={`${headerSize} font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-4 tracking-tight`}>
                  Matchstick Math
                </h1>
                <p className="text-slate-300 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto px-2 sm:px-0 leading-tight sm:leading-normal">
                  Solve mathematical puzzles by moving matchsticks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl sm:text-3xl font-bold text-cyan-400 mb-1 sm:mb-2">
                  {completedLevels.size}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">Completed</div>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl sm:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">
                  {AllMatchistickPuzzles?.length || 0}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">Total Levels</div>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl sm:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2">
                  {Math.round((completedLevels.size / (AllMatchistickPuzzles?.length || 1)) * 100)}%
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">Progress</div>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-between text-slate-400 text-xs sm:text-sm mb-2">
            <span>Your Progress</span>
            <span>{completedLevels.size}/{AllMatchistickPuzzles?.length || 0}</span>
          </div>
          <div className=" bg-slate-800 rounded-full h-2 sm:h-3">
         <div
  className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out"
  style={{
    width: `${(completedLevels.size / (AllMatchistickPuzzles?.length || 1)) * 100}%`,
    minWidth: '0%', // ensures smooth animation
    maxWidth: '100%',
  }}
/>

          </div>
        </div>

        {/* Levels Grid */}
        <div 
          className={`grid grid-cols-4 gap-3 mx-auto max-w-6xl`}
          style={{
            gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
            gap: `${gridConfig.gap * 0.25}rem`
          }}
        >
          {AllMatchistickPuzzles?.map((data, index) => {
            const status = getLevelStatus(data._id)
            const isCompleted = status === 'completed'
            
            return (
              <Link 
                to={`/matchstickpuzzle/${data?._id}`} 
                key={index}
                className="group relative block"
              >
                {/* Level Card */}
                <div 
                  className={`
                    relative rounded-xl sm:rounded-2xl transition-all duration-500 transform
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105' 
                      : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:scale-105 shadow-lg hover:shadow-cyan-500/20'
                    }
                    flex items-center justify-center overflow-hidden
                    aspect-square
                  `}
                  style={{ 
                    minHeight: gridConfig.cardSize,
                    maxHeight: gridConfig.cardSize
                  }}
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:8px_8px]" />
                  
                  {/* Completed Checkmark */}
                  {isCompleted && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Level Number */}
                  <span className={`
                    ${fontSize} font-bold transition-all duration-300 relative z-10
                    ${isCompleted 
                      ? 'text-white drop-shadow-lg' 
                      : 'text-slate-300 group-hover:text-white drop-shadow'
                    }
                  `}>
                    {data?.level}
                  </span>

                  {/* Hover Glow */}
                  <div className={`
                    absolute inset-0 rounded-xl sm:rounded-2xl transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-white/20 to-white/5 opacity-0 group-hover:opacity-100' 
                      : 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100'
                    }
                  `} />
                </div>

                {/* Level Progress Indicator */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 sm:h-1 rounded-full bg-slate-700">
                  <div 
                    className={`
                      h-full rounded-full transition-all duration-700 ease-out
                      ${isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full' 
                        : 'bg-gradient-to-r from-cyan-400 to-purple-400 w-0 group-hover:w-1/2'
                      }
                    `}
                  />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Empty State */}
        {(!AllMatchistickPuzzles || AllMatchistickPuzzles.length === 0) && (
          <div className="text-center py-12 sm:py-24">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">No Levels Available</h3>
            <p className="text-slate-500 text-sm sm:text-base">New levels will be added soon</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 sm:mt-16 pb-8">
          <p className="text-slate-500 text-xs sm:text-sm">
            Complete levels to unlock achievements and progress
          </p>
        </div>
      </div>
    </div>
  )
}
import React from 'react';

export default function StatsLoading() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-green-100 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4 pb-2 border-b border-gray-100"></div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="bg-gray-50 p-3">
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="p-4 bg-white">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-20 bg-green-100 rounded-full animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Stats Section */}
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6 pb-2 border-b border-gray-100"></div>

          {/* User header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg shadow" style={{
                backgroundColor: i === 0 ? '#EBF5FF' : i === 1 ? '#ECFDF5' : '#F5F3FF'
              }}>
                <div className="h-4 w-24 rounded animate-pulse mb-2" style={{
                  backgroundColor: i === 0 ? '#BFDBFE' : i === 1 ? '#A7F3D0' : '#DDD6FE'
                }}></div>
                <div className="h-8 w-16 rounded animate-pulse" style={{
                  backgroundColor: i === 0 ? '#BFDBFE' : i === 1 ? '#A7F3D0' : '#DDD6FE'
                }}></div>
                <div className="h-4 w-32 rounded animate-pulse mt-1" style={{
                  backgroundColor: i === 0 ? '#BFDBFE' : i === 1 ? '#A7F3D0' : '#DDD6FE'
                }}></div>
              </div>
            ))}
          </div>

          {/* Detailed Stats Section */}
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg shadow" style={{
                backgroundColor: i === 0 ? '#FEF2F2' : i === 1 ? '#FFFBEB' : '#EEF2FF'
              }}>
                <div className="h-4 w-28 rounded animate-pulse mb-2" style={{
                  backgroundColor: i === 0 ? '#FECACA' : i === 1 ? '#FDE68A' : '#C7D2FE'
                }}></div>
                <div className="h-8 w-16 rounded animate-pulse" style={{
                  backgroundColor: i === 0 ? '#FECACA' : i === 1 ? '#FDE68A' : '#C7D2FE'
                }}></div>
              </div>
            ))}
          </div>

          {/* Best Times Table */}
          <div className="mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="bg-gray-50 p-2">
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 bg-white">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-16 bg-green-100 rounded-full animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-20 bg-blue-100 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
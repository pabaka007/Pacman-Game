import React from 'react';

interface ScoreBoardProps {
  score: number;
  lives: number;
  level: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, lives, level }) => {
  return (
    <div className="flex justify-between items-center mb-4 px-2 py-2 border-b-2 border-blue-500">
      <div className="text-white">
        <span className="text-yellow-400 font-bold">SCORE:</span> {score}
      </div>
      
      <div className="flex items-center">
        <span className="text-white mr-2">LIVES:</span>
        {[...Array(lives)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-2xl px-1">ᗧ</span>
        ))}
      </div>
      
      <div className="text-white">
        <span className="text-blue-400 font-bold">LEVEL:</span> {level}
      </div>
    </div>
  );
};

export default ScoreBoard;
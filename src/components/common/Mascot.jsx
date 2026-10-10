import React from 'react';
const MASCOT_POSES = {
    proud: {
        src: '/mascot-proud.png',
        alt: 'Kipo Mascot Proud A+'
    },
    inspect: {
        src: '/mascot-inspect.png',
        alt: 'Kipo Mascot Inspecting'
    },
    puzzled: {
        src: '/mascot-puzzled.png',
        alt: 'Kipo Mascot Puzzled'
    }
};
export const Mascot = ({ pose = 'proud', size = 'md', className = '', bubbleText = null }) => {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-20 h-20 sm:w-24 sm:h-24',
        lg: 'w-32 h-32 sm:w-40 sm:h-40'
    };
    const selectedPose = MASCOT_POSES[pose] || MASCOT_POSES.proud;
    return (<div className={`inline-flex items-center gap-3 ${className}`}>
      <img src={selectedPose.src} alt={selectedPose.alt} className={`${sizeClasses[size] || sizeClasses.md} object-contain select-none transition-transform duration-200 hover:scale-105 drop-shadow-sm`} loading="lazy"/>
      {bubbleText && (<div className="relative bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-700 shadow-sm max-w-xs animate-in fade-in zoom-in-95 duration-200">
          {bubbleText}
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-slate-200 rotate-45"/>
        </div>)}
    </div>);
};

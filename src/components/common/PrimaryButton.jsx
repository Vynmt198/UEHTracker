import React from 'react';
export const PrimaryButton = ({ icon, children, variant = 'interactive', size = 'md', fullWidth = false, className = '', ...props }) => {
    const sizeClasses = {
        sm: 'text-xs py-1.5 px-3',
        md: 'text-xs sm:text-sm py-2 px-3.5',
        lg: 'text-sm py-2.5 px-5'
    }[size];
    const variantClass = {
        fly: 'btn-uiverse-fly',
        ueh: 'btn-ueh',
        interactive: 'btn-interactive-primary',
        outline: 'btn-interactive-outline'
    }[variant];
    return (<button className={`${variantClass} ${sizeClasses} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {icon && (<div className="svg-wrapper shrink-0">
          {icon}
        </div>)}
      <span>{children}</span>
    </button>);
};

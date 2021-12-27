import React, { useState } from 'react';

const SelectLanguage: React.FC = function SelectLanguage() {
  const [language, setLanguage] = useState('zh-CN');

  const changeLanguage = (e: any) => {
    setLanguage('en');
    console.log('choose');
  };

  return (
    <div>
      <span>语言切换</span>
      <select value={language} onChange={(e) => changeLanguage(e)}>
        <option value="zh-CN">简</option>
        <option value="en-US">英</option>
      </select>
    </div>
  );
};

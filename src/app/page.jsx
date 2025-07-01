'use client';
import './page.scss';
import React from 'react';
import 'github-markdown-css/github-markdown.css';
import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import fediverseUser from 'remark-fediverse-user';
import emoji from 'remark-emoji';
import remarkCodeTitles from 'remark-flexible-code-titles';
import Header from '../Header';
import HelpModal from '../Help';

const App = () => {
  const [viewMode, setViewMode] = useState('both');
  const [md, setMD] = useState('Start Writing');

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('viewMode');
      if (savedMode) {
        setViewMode(savedMode);
      }
      const savedMD = localStorage.getItem('markdownContent');
      if (savedMD) {
        setMD(savedMD);
      }
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('viewMode', viewMode);
    } catch (error) {
      console.error('Error saving view mode to local storage:', error);
    }
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('markdownContent', md);
  }, [md]);

  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('[SW] Registered:', reg);
      }).catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
    });
  }
  if (typeof window !== 'undefined') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        // new Notification("📌 Reminder!", {
        //   body: "Don't forget to finish your T0do.TxT!",
        //   icon: "/assets/icon192.png",
        // });
      }
    });
  }

  const handleMDChange = (e) => {
    setMD(e.target.value);
  };

  const MarkdownComponent = () => {
    return (
      <div>
        <Markdown remarkPlugins={[remarkGfm, remarkBreaks, fediverseUser, emoji, remarkCodeTitles]}>{md}</Markdown>
      </div>
    );
  };

  return (
    <>
      <Header viewMode={viewMode} setViewMode={setViewMode} />
      <HelpModal/>
      <div className='unified-editor markdown-body'>
        <div style={{ position: 'relative', display: 'inline-block' }}>
        </div>
        {(viewMode === 'text') ? (
          <textarea
            className='textarea'
            placeholder='Start Writing'
            value={md}
            onChange={handleMDChange}
            autoFocus
          ></textarea>
        ) : null}

        {(viewMode === 'both') ? (
          <>
            <div className='unified-txt'>
              <h2>Text </h2>
              <textarea
                className='textarea unified-txt'
                placeholder='Start Writing'
                value={md}
                onChange={handleMDChange}
                autoFocus
              ></textarea>
            </div>
            <div className='unified-md'>           <h2>Markdown </h2>
              <MarkdownComponent />
            </div>
          </>
        ) : null}
        {viewMode === 'markdown' ? (
          <div className='md'>             <MarkdownComponent />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default App;


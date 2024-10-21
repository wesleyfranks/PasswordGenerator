// PasswordGenerator.jsx

import React, { useState, useEffect, useRef } from 'react';

const PasswordGenerator = () => {
  // State variables
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12); // Default character count
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeDuplicates: true,
    words: false,
  });
  const [passIndicator, setPassIndicator] = useState('weakest');
  const [copyStatus, setCopyStatus] = useState(false);

  // Reference for the textarea
  const passwordRef = useRef(null);

  // Character sets
  const characters = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!$%&|[](){}:;.,*+-#@<>~',
  };

  // Define constants for min and max values
  const defaultMinLength = 1;
  const defaultMaxLength = 64; // Max length for character-based passwords
  const wordsMinLength = 1;
  const wordsMaxLength = 10; // Max word count for words-based passwords

  // Compute minLength and maxLength based on options.words
  const minLength = options.words ? wordsMinLength : defaultMinLength;
  const maxLength = options.words ? wordsMaxLength : defaultMaxLength;

  // Fetch words from API
  const getWords = async (numWords) => {
    const wordsAPI = `https://random-word-api.vercel.app/api?words=${numWords}`;

    try {
      const response = await fetch(wordsAPI);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Generate password
  const generatePassword = async () => {
    if (options.words) {
      const numWords = length;
      const words = await getWords(numWords);
      setPassword(words.join(''));
    } else {
      let staticPassword = '';
      for (const key in options) {
        if (options[key] && characters[key]) {
          staticPassword += characters[key];
        }
      }

      if (!staticPassword) {
        setPassword('');
        return;
      }

      let characterList = staticPassword;

      if (options.excludeDuplicates) {
        characterList = [...new Set(characterList)].join('');
      }

      let randomPassword = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterList.length);
        randomPassword += characterList[randomIndex];
      }
      setPassword(randomPassword);
    }
  };

  // Update password strength indicator
  const updatePassIndicator = () => {
    if (options.words) {
      // When 'Words' option is selected, base the strength on the number of words
      if (length <= 2) {
        setPassIndicator('weakest');
      } else if (length <= 4) {
        setPassIndicator('weak');
      } else if (length <= 7) {
        setPassIndicator('medium');
      } else {
        setPassIndicator('strong');
      }
    } else {
      // Existing logic for when 'Words' is not selected
      let strength = 0;

      // Length criteria
      if (length >= 8) strength += 1;
      if (length >= 12) strength += 1;
      if (length >= 16) strength += 1;

      // Character type criteria
      const typesCount = [
        'lowercase',
        'uppercase',
        'numbers',
        'symbols',
      ].reduce((acc, key) => {
        return options[key] ? acc + 1 : acc;
      }, 0);

      if (typesCount >= 2) strength += 1;
      if (typesCount >= 3) strength += 1;

      // Set passIndicator based on strength score
      if (strength <= 2) {
        setPassIndicator('weakest');
      } else if (strength === 3) {
        setPassIndicator('weak');
      } else if (strength === 4) {
        setPassIndicator('medium');
      } else {
        setPassIndicator('strong');
      }
    }
  };

  // Copy password to clipboard
  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 1000);
    }
  };

  // Set default length when options.words changes
  useEffect(() => {
    if (options.words) {
      // Switching to words mode
      setLength(5); // Default word count
    } else {
      // Switching to characters mode
      setLength(12); // Default character count
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.words]);

  // Update password and indicator when options or length change
  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options]);

  // Update indicator when password, length, or options change
  useEffect(() => {
    updatePassIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, length, options]);

  // Adjust textarea height when password changes
  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.style.height = 'auto';
      passwordRef.current.style.height =
        passwordRef.current.scrollHeight + 'px';
    }
  }, [password]);

  return (
    <>
      <div className="container">
        <h2>Password Generator</h2>
        <div className="wrapper">
          <div className="input-box">
            <textarea
              title="password"
              value={password}
              readOnly
              rows={1}
              ref={passwordRef}
              onChange={() => {}}
            />
            <span
              className="material-symbols-rounded"
              onClick={copyPassword}
              style={{
                cursor: 'pointer',
                color: copyStatus ? '#43A047' : '#707070',
              }}
            >
              {copyStatus ? 'check' : 'copy_all'}
            </span>
          </div>
          <div className={`pass-indicator ${passIndicator}`}></div>
          <div className="pass-length">
            <div className="details">
              <label className="title">Password Length</label>
              <span>{length}</span>
            </div>
            <input
              title="range"
              type="range"
              min={minLength}
              max={maxLength}
              value={length}
              step="1"
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>
          <div className="pass-settings">
            <label className="title">Pass Settings</label>
            <ul className="options">
              <li className="option">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={options.lowercase}
                  disabled={options.words}
                  onChange={(e) =>
                    setOptions({ ...options, lowercase: e.target.checked })
                  }
                />
                <label htmlFor="lowercase">Lowercase (a-z)</label>
              </li>
              <li className="option">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={options.uppercase}
                  disabled={options.words}
                  onChange={(e) =>
                    setOptions({ ...options, uppercase: e.target.checked })
                  }
                />
                <label htmlFor="uppercase">Uppercase (A-Z)</label>
              </li>
              <li className="option">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={options.numbers}
                  disabled={options.words}
                  onChange={(e) =>
                    setOptions({ ...options, numbers: e.target.checked })
                  }
                />
                <label htmlFor="numbers">Numbers (0-9)</label>
              </li>
              <li className="option">
                <input
                  type="checkbox"
                  id="symbols"
                  checked={options.symbols}
                  disabled={options.words}
                  onChange={(e) =>
                    setOptions({ ...options, symbols: e.target.checked })
                  }
                />
                <label htmlFor="symbols">Symbols (!@#$%)</label>
              </li>
              <li className="option">
                <input
                  type="checkbox"
                  id="excludeDuplicates"
                  checked={options.excludeDuplicates}
                  disabled={options.words}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      excludeDuplicates: e.target.checked,
                    })
                  }
                />
                <label htmlFor="excludeDuplicates">Exclude Duplicates</label>
              </li>
              <li className="option">
                <input
                  type="checkbox"
                  id="words"
                  checked={options.words}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      words: e.target.checked,
                    })
                  }
                />
                <label htmlFor="words">Words (Random)</label>
              </li>
            </ul>
          </div>

          <button className="generate-btn" onClick={generatePassword}>
            Generate Password
          </button>
        </div>
      </div>
    </>
  );
};

export default PasswordGenerator;

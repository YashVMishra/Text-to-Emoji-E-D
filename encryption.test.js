/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

beforeAll(() => {
    // Load the HTML file
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    document.documentElement.innerHTML = html;
});

test('checks if the page title is correct', () => {
    expect(document.title).toBe('Text to Enojis E/D');
});

test('checks if the main heading exists', () => {
    const mainHeading = document.querySelector('h1');
    expect(mainHeading).not.toBeNull();
    expect(mainHeading.textContent).toContain('Text');
});

test('checks if encrypt button exists', () => {
    const encryptBtn = document.querySelector('#encrypt-btn');
    expect(encryptBtn).not.toBeNull();
    expect(encryptBtn.textContent).toContain('Encrypt Text');
});

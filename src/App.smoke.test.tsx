import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from './App';

describe('App smoke test', () => {
  it('renders the full app to HTML without crashing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Alloy Alchemist');
    expect(html).toContain('Mix your alloy');
    expect(html).toContain('The transmutation');
    expect(html).toContain('The iron');
    expect(html).toContain('Under the microscope');
    expect(html).toContain('Ask the Alchemist');
    expect(html).toContain('AISI 1045');
    expect(html).toContain('Educational estimates');
  });
});

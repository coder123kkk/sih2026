'use client';
import React from 'react';
import { Target, Clock } from 'lucide-react';

/**
 * Parses inline markdown: **bold**, *italic*, [code-badges], (duration/score badges)
 */
function renderInline(text) {
  if (!text) return null;

  const regex = /(\*\*[^*]+\*\*|\[(?:igot-crs-[^\]]+|NSSTA[^\]]+)\]|\(Current:[^)]+\)|\(\d+h\s*\d*m?\)|\(\d+\s*days?\))/gi;
  const splits = text.split(regex);

  return splits.map((segment, i) => {
    if (!segment) return null;

    // 1. **bold**
    if (segment.startsWith('**') && segment.endsWith('**')) {
      const inner = segment.slice(2, -2);
      return (
        <strong key={i} style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {inner}
        </strong>
      );
    }

    // 2. [course-id]
    if (/^\[(?:igot-crs-[^\]]+|NSSTA[^\]]+)\]$/i.test(segment)) {
      const code = segment.slice(1, -1);
      const isIgot = code.toLowerCase().startsWith('igot');
      return (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '1px 6px',
            borderRadius: 4,
            fontSize: '0.74rem',
            fontFamily: 'monospace',
            fontWeight: 700,
            margin: '0 3px',
            background: isIgot ? 'rgba(217, 119, 6, 0.1)' : 'rgba(79, 70, 229, 0.1)',
            color: isIgot ? '#B45309' : '#4338CA',
            border: `1px solid ${isIgot ? 'rgba(217, 119, 6, 0.25)' : 'rgba(79, 70, 229, 0.25)'}`
          }}
        >
          {code}
        </span>
      );
    }

    // 3. (Current: X%, Required: Y%)
    if (/^\(Current:[^)]+\)$/i.test(segment)) {
      return (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '1px 7px',
            borderRadius: 4,
            fontSize: '0.76rem',
            fontWeight: 600,
            margin: '0 3px',
            background: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #FDE68A'
          }}
        >
          <Target size={11} style={{ flexShrink: 0 }} />
          {segment.slice(1, -1)}
        </span>
      );
    }

    // 4. (Xh Ym) or duration
    if (/^\(\d+h\s*\d*m?\)|\(\d+\s*days?\)$/i.test(segment)) {
      return (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '1px 6px',
            borderRadius: 4,
            fontSize: '0.74rem',
            margin: '0 2px',
            background: '#F1F5F9',
            color: '#475569'
          }}
        >
          <Clock size={11} style={{ flexShrink: 0 }} />
          {segment.slice(1, -1)}
        </span>
      );
    }

    return segment;
  });
}

/**
 * Parses markdown tables
 */
function renderTable(tableLines, key) {
  if (tableLines.length < 2) return null;

  const headerCells = tableLines[0]
    .split('|')
    .map(c => c.trim())
    .filter((c, i, arr) => i > 0 && i < arr.length - 1);

  const bodyRows = tableLines.slice(2).map(line =>
    line
      .split('|')
      .map(c => c.trim())
      .filter((c, i, arr) => i > 0 && i < arr.length - 1)
  );

  return (
    <div key={key} style={{ overflowX: 'auto', margin: '14px 0' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.82rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: '#FFFFFF'
        }}
      >
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border)' }}>
            {headerCells.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '9px 12px',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr
              key={rIdx}
              style={{
                borderBottom: rIdx === bodyRows.length - 1 ? 'none' : '1px solid #F1F5F9',
                background: rIdx % 2 === 1 ? '#FAFAFA' : '#FFFFFF'
              }}
            >
              {row.map((cell, cIdx) => {
                const isSeverity = cell.includes('Critical') || cell.includes('High') || cell.includes('Medium');
                return (
                  <td key={cIdx} style={{ padding: '8px 12px', verticalAlign: 'middle' }}>
                    {isSeverity ? (
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: cell.includes('Critical')
                            ? '#FEE2E2'
                            : cell.includes('High')
                            ? '#FEF3C7'
                            : '#E0E7FF',
                          color: cell.includes('Critical')
                            ? '#DC2626'
                            : cell.includes('High')
                            ? '#D97706'
                            : '#4F46E5',
                          border: `1px solid ${
                            cell.includes('Critical')
                              ? '#FECACA'
                              : cell.includes('High')
                              ? '#FDE68A'
                              : '#C7D2FE'
                          }`
                        }}
                      >
                        {cell.replace(/\*/g, '')}
                      </span>
                    ) : (
                      renderInline(cell)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Rich Formatted Message Renderer
 */
export default function FormattedMessage({ text = '', isUser = false }) {
  if (!text) return null;

  if (isUser) {
    return <div style={{ lineHeight: 1.55 }}>{text}</div>;
  }

  const rawLines = text.split('\n');
  const elements = [];
  let tableBuffer = [];
  let inTable = false;

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      elements.push(renderTable(tableBuffer, `table-${elements.length}`));
      tableBuffer = [];
      inTable = false;
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    // Check if line is a table line
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      tableBuffer.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Horizontal Rule
    if (line === '---' || line === '***') {
      elements.push(
        <hr
          key={`hr-${i}`}
          style={{
            border: 'none',
            borderTop: '1px solid var(--color-border)',
            margin: '14px 0',
            opacity: 0.8
          }}
        />
      );
      continue;
    }

    // Headings: ###
    if (line.startsWith('### ')) {
      elements.push(
        <h4
          key={`h3-${i}`}
          style={{
            fontSize: '0.94rem',
            fontWeight: 700,
            margin: '16px 0 8px 0',
            color: 'var(--color-brand)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {renderInline(line.slice(4))}
        </h4>
      );
      continue;
    }

    // Headings: ##
    if (line.startsWith('## ')) {
      elements.push(
        <h3
          key={`h2-${i}`}
          style={{
            fontSize: '1.02rem',
            fontWeight: 700,
            margin: '18px 0 10px 0',
            color: 'var(--color-text-primary)'
          }}
        >
          {renderInline(line.slice(3))}
        </h3>
      );
      continue;
    }

    // Numbered item: e.g. "1. **[igot-crs-008] Survey Design...** (6h 00m) — Addresses..."
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const content = numberedMatch[2];
      elements.push(
        <div
          key={`num-${i}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            margin: '8px 0',
            padding: '10px 14px',
            background: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.88rem',
            lineHeight: 1.55
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1
            }}
          >
            {num}
          </span>
          <div style={{ flex: 1 }}>{renderInline(content)}</div>
        </div>
      );
      continue;
    }

    // Bullet item: e.g. "* [NSSTA001]..." or "- item"
    if (line.startsWith('* ') || line.startsWith('- ')) {
      elements.push(
        <div
          key={`bullet-${i}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            margin: '4px 0',
            paddingLeft: 4,
            fontSize: '0.88rem',
            lineHeight: 1.55
          }}
        >
          <span
            style={{
              color: 'var(--color-brand)',
              fontSize: '1rem',
              lineHeight: 1,
              marginTop: 3,
              flexShrink: 0
            }}
          >
            •
          </span>
          <div style={{ flex: 1 }}>{renderInline(line.slice(2))}</div>
        </div>
      );
      continue;
    }

    // Empty line
    if (!line) {
      elements.push(<div key={`sp-${i}`} style={{ height: 6 }} />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={`p-${i}`}
        style={{
          margin: '0 0 8px 0',
          lineHeight: 1.6,
          fontSize: '0.91rem',
          color: 'var(--color-text-primary)'
        }}
      >
        {renderInline(line)}
      </p>
    );
  }

  flushTable();

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{elements}</div>;
}

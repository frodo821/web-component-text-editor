import jsx from '../jsx';
import mainScss from '../main.scss';

function moduleToString(mod: string) {
  const list: string[] = [];
  function require() {
    return () => list;
  }
  // tslint:disable-next-line: prefer-const
  const module = {};
  // tslint:disable-next-line: no-eval
  eval(mod);
  return list.map(it => it[1]).join();
}

String.prototype.insertAt = function(pos, str) {
  return this.slice(0, pos) + str + this.slice(pos);
};
String.prototype.deleteAt = function(pos) {
  if (pos < 0) return this.toString();
  return this.slice(0, pos) + this.slice(pos + 1);
};

export default class TextEditor extends jsx.Component<
  {
    rows: number;
    columns: number;
  },
  HTMLElement
> {
  public data: string = '';
  public code: Element;
  public pos: { x: number; y: number } = { x: 0, y: 0 };
  public keyBindings: { [key: string]: () => void } = {};

  constructor() {
    super();
    this.code = this.querySelector('.display')!;
    const il = this.querySelector('.input-line')! as HTMLDivElement;
    const cr = this.querySelector('.caret')! as HTMLDivElement;
    const te = this.querySelector('.input-area') as HTMLTextAreaElement;
    this.props = {
      rows: parseInt(this.getAttribute('rows') || '40'),
      columns: parseInt(this.getAttribute('columns') || '120')
    };
    this.current.style.width = `${7 * this.props.columns + 17}px`;
    this.current.style.height = `${15 * this.props.rows + 17}px`;
    this.current.addEventListener('click', _ => te.focus());
    il.addEventListener('input', _ => {
      console.log('keydown');
      this.triggerEvent('charenter', { char: te.value, source: this });
      this.data = this.data.insertAt(this.totalCaretPos, te.value);
      this.pos.x += te.value.length;
      te.value = '';
    });
    il.addEventListener('keydown', ke => {
      ke.stopPropagation();
      if (ke.ctrlKey || ke.metaKey || ke.altKey) {
        const binding = this.keyBindings[this.generateUKE(ke)];
        if (typeof binding === 'function') {
          binding();
        }
        return;
      }
      switch (ke.key) {
        case 'Enter':
          this.data = this.data.insertAt(this.totalCaretPos, '\n');
          this.pos.y += 1;
          this.pos.x = 0;
          this.triggerEvent('linebreak', { source: this });
          break;
        case 'Backspace':
          this.triggerEvent('chardelete', { source: this });
          this.data = this.data.deleteAt(this.totalCaretPos);
          if (this.pos.x === 0) {
            if (this.pos.y === 0) return;
            this.pos.y -= 1;
            this.triggerEvent('linedelete', { source: this });
            this.pos.x = this.currentLine.columns;
          } else {
            this.pos.x -= 1;
          }
          break;
        default:
          if (ke.key.length !== 1) {
            const binding = this.keyBindings[this.generateUKE(ke)];
            if (typeof binding === 'function') {
              binding();
            }
          }
      }
      this.updateDisplay();
      this.triggerEvent('beforeupdate', { source: this });
      il.style.top = `${8.5 + this.pos.y * 15}px`;
      cr.style.left = `${this.pos.x * 7}px`;
    });
    (window as any).editor = this;
  }

  /**
   * generates UKE(uniform keybinding expression) from key event
   * @param key source event
   */
  generateUKE(key: KeyboardEvent) {
    return `${key.altKey ? '`' : ''}${key.ctrlKey ? '^' : ''}${
      key.shiftKey ? '@' : ''
    }${key.key}`;
  }

  updateDisplay() {
    const alter = (
      <code className="display">
        {(this.data || '').split('\n').map(it => (
          <div className="display-line">{it}</div>
        ))}
      </code>
    );

    this.code.replaceWith(alter);
    this.code = alter;
  }

  render() {
    return (
      <code className="container">
        <div className="display">
          {(this.data || '').split('\n').map(it => (
            <div className="display-line">{it}</div>
          ))}
        </div>
        <div className="input-line" style="top: 0.5rem">
          <textarea
            className="input-area caret"
            wrap="off"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            role="textbox"
            aria-multiline="true"
            aria-haspopup="false"
            aria-autocomplete="both"
          />
        </div>
      </code>
    );
  }

  styleOf() {
    return moduleToString(mainScss);
  }

  get lines(): number {
    return this.code.childElementCount;
  }

  get totalCaretPos(): number {
    const ln = this.currentLine;
    return ln.start + this.pos.x;
  }

  get currentLine(): {
    start: number;
    end: number;
    columns: number;
    text: string;
  } {
    const start = this.data
      .split('\n')
      .slice(0, this.pos.y)
      .join('\n').length;
    const end =
      start +
      (
        (this.code.children[this.pos.y] || { textContent: '' }).textContent || {
          length: 0
        }
      ).length;
    return {
      start,
      end,
      columns: end - start,
      text: this.data.substr(start, end)
    };
  }
}

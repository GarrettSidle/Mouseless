import { Component } from "react";
import "./Shortcuts.css";
import shortcutsData from "../../data/shortcuts.json";

interface Shortcut {
  id: string;
  name: string;
  keys: string[];
  description: string;
  category: string;
  still: string;
  gif: string;
}

interface ShortcutsState {
  hoveredShortcut: string | null;
}

export class Shortcuts extends Component<{}, ShortcutsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      hoveredShortcut: null,
    };
  }

  handleMouseEnter = (shortcutId: string) => {
    this.setState({ hoveredShortcut: shortcutId });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredShortcut: null });
  };

  renderKeyBadge = (key: string) => {
    return (
      <span key={key} className="key-badge">
        {key}
      </span>
    );
  };

  getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Navigation: "#4A9EFF",
      Search: "#FF6B6B",
      Editing: "#51CF66",
      Selection: "#FFD93D",
      Formatting: "#A78BFA",
      Refactoring: "#F472B6",
      View: "#60A5FA",
    };
    return colors[category] || "#94A3B8";
  };

  render() {
    const shortcuts = shortcutsData as Shortcut[];
    const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

    return (
      <div className="shortcuts-page">
        <div className="shortcuts-header">
          <h1>Keyboard Shortcuts</h1>
          <p className="subtitle">
            Master these VSCode shortcuts to code efficiently without a mouse
          </p>
        </div>

        <div className="shortcuts-container">
          {categories.map((category) => (
            <div key={category} className="shortcuts-category">
              <h2
                className="category-title"
                style={
                  {
                    "--category-color": this.getCategoryColor(category),
                  } as React.CSSProperties
                }
              >
                {category}
              </h2>
              <div className="shortcuts-grid">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className="shortcut-card"
                      onMouseEnter={() => this.handleMouseEnter(shortcut.id)}
                      onMouseLeave={this.handleMouseLeave}
                    >
                      <div className="shortcut-header">
                        <div className="shortcut-info">
                          <h3 className="shortcut-name">{shortcut.name}</h3>
                          <p className="shortcut-description">
                            {shortcut.description}
                          </p>
                        </div>
                        <div className="shortcut-keys">
                          {shortcut.keys.map((key, index) => (
                            <span key={index}>
                              {this.renderKeyBadge(key)}
                              {index < shortcut.keys.length - 1 && (
                                <span className="key-separator">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shortcut-demo">
                        <div className="gif-container">
                          <img
                            src={
                              this.state.hoveredShortcut === shortcut.id
                                ? shortcut.gif
                                : shortcut.still
                            }
                            alt={`${shortcut.name} demo`}
                            className="shortcut-gif"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Shortcuts;

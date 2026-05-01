import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styled/dashboard.css";

export default function Dashboard() {
  const { user, authFetch } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await authFetch("/meals/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError("Failed to load stats.");
      }
    } catch {
      setError("Failed to load stats.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1>📊 My Dashboard</h1>
        <div className="dashboard-skeleton">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="skeleton-section"></div>
          ))}
        </div>
      </div>
    );
  }

  const maxCooked = stats?.frequentlyCooked?.[0]?.count || 1;
  const maxSearched = stats?.frequentlySearched?.[0]?.count || 1;

  return (
    <div className="dashboard-page">
      <h1>📊 My Dashboard</h1>
      <p className="dashboard-subtitle">
        Welcome back, <strong>{user?.name}</strong>! Here's your cooking analytics.
      </p>

      {error && <p className="dashboard-error">{error}</p>}

      <div className="dashboard-grid">
        {/* Frequently Cooked Meals */}
        <section className="dash-section">
          <div className="dash-section-header">
            <span className="dash-icon">🔥</span>
            <h2>Frequently Cooked Meals</h2>
          </div>

          {!stats?.frequentlyCooked?.length ? (
            <div className="dash-empty">
              <p>No data yet. Start cooking to see your top meals!</p>
            </div>
          ) : (
            <div className="dash-list">
              {stats.frequentlyCooked.map((item, idx) => (
                <div key={item._id} className="dash-item">
                  <div className="dash-rank">#{idx + 1}</div>
                  <div className="dash-item-img">
                    <img src={item.mealThumb} alt={item.mealName} />
                  </div>
                  <div className="dash-item-info">
                    <h4>{item.mealName}</h4>
                    <div className="dash-item-meta">
                      {item.category && <span>{item.category}</span>}
                      {item.area && <span>{item.area}</span>}
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${(item.count / maxCooked) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="dash-count">
                    <span className="count-number">{item.count}</span>
                    <span className="count-label">times</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Frequently Searched Ingredients */}
        <section className="dash-section">
          <div className="dash-section-header">
            <span className="dash-icon">🔍</span>
            <h2>Frequently Searched Ingredients</h2>
          </div>

          {!stats?.frequentlySearched?.length ? (
            <div className="dash-empty">
              <p>No searches yet. Search by ingredients to see your patterns!</p>
            </div>
          ) : (
            <div className="dash-tags-list">
              {stats.frequentlySearched.map((item, idx) => (
                <div key={item.ingredient} className="dash-tag-item">
                  <div className="dash-rank">#{idx + 1}</div>
                  <div className="dash-tag-info">
                    <span className="dash-tag-name">{item.ingredient}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill search-fill"
                        style={{ width: `${(item.count / maxSearched) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="dash-count">
                    <span className="count-number">{item.count}</span>
                    <span className="count-label">searches</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

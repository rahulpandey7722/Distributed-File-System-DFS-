import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{
      width: "200px",
      height: "100vh",
      background: "#020617",
      color: "white",
      padding: "20px"
    }}>
      <h2>DFS</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/" style={linkStyle}>Dashboard</Link></li>
        <li><Link to="/files" style={linkStyle}>My Files</Link></li>
        <li><Link to="/upload" style={linkStyle}>Upload</Link></li>
        <li><Link to="/nodes" style={linkStyle}>Nodes</Link></li>
        <li><Link to="/replication" style={linkStyle}>Replications</Link></li>
      </ul>
    </div>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  padding: "10px 0"
};

export default Sidebar;
import { NavLink, Outlet } from "react-router-dom";

function A() {
  return (
    <div>
      A<NavLink to="/">D</NavLink>
      <NavLink to="/e">E</NavLink>
      <Outlet />
    </div>
  );
}

export default A;

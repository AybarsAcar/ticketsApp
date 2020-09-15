import Link from 'next/link';

const Header = ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {!currentUser ? (
            <>
              <li className="nav-item m-2">
                <Link href="/auth/signup">
                  <a>Sign Up</a>
                </Link>
              </li>

              <li className="nav-item m-2">
                <Link href="/auth/signin">
                  <a>Sign In</a>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item m-2">
                <Link href="/orders">
                  <a>My Orders</a>
                </Link>
              </li>
              <li className="nav-item m-2">
                <Link href="/tickets/new">
                  <a>Sell Tickets</a>
                </Link>
              </li>
              <li className="nav-item m-2">
                <Link href="/auth/signout">
                  <a>Sign Out</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;

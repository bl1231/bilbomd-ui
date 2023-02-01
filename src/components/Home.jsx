import { Link } from 'react-router-dom';

const Home = () => {
  const content = (
    <section className="public">
      <header>
        <h1>Welcome to BilboMD!</h1>
      </header>
      <main>
        <p>
          Located in building 15 room 234 on teh LBNL campus in Sunny Berkeley,
          CA , BilboMD provides an advanced Molecular Dynamics tool to analyze
          your SAXS needs.
        </p>
        <p>&nbsp;</p>
        <address>
          Repair Store
          <br />
          555 Foo Drive
          <br />
          Foo City, CA 12345
          <br />
          <a href="tel:+15555555555">(555) 555-5555</a>
        </address>
      </main>
      <footer>
        <Link to="/login">Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Home;

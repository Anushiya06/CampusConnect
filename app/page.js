import Link from 'next/link';
import '../styles/home.css';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="college-logo">
            <div className="logo-circle">
              <span className="logo-text">CC</span>
            </div>
          </div>
          <h1>Welcome to Campus Connect</h1>
          <h2>Digital Guestbook</h2>
          <p>
            Share your campus experience and connect with our community. 
            Leave your mark and read messages from fellow students, faculty, and visitors.
          </p>
          
          <div className="buttons">
            <Link href="/guestbook" className="btn btn-primary">
              Leave a Message
            </Link>
            <Link href="/guestbook" className="btn btn-secondary">
              View Entries
            </Link>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-number">1,250+</div>
              <div className="stat-label">Messages</div>
            </div>
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Faculty</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section about">
        <div className="container">
          <div className="about-content">
            <h2>About Our Digital Guestbook</h2>
            <p>
              Campus Connect is our digital platform for sharing experiences, memories, and messages 
              within our college community. Whether you're a student, faculty member, or visitor, 
              this is your space to connect and contribute to our campus story.
            </p>
            
            <div className="benefits">
              <div className="benefit">
                <div className="benefit-content">
                  <h4>Share Your Experience</h4>
                  <p>Tell your campus story and inspire others</p>
                </div>
              </div>
              
              <div className="benefit">
                <div className="benefit-content">
                  <h4>Connect with Community</h4>
                  <p>Read messages from fellow students and faculty</p>
                </div>
              </div>
              
              <div className="benefit">
                <div className="benefit-content">
                  <h4>Leave Your Mark</h4>
                  <p>Create lasting memories for future visitors</p>
                </div>
              </div>
              
              <div className="benefit">
                <div className="benefit-content">
                  <h4>Track Your Journey</h4>
                  <p>Keep a record of your campus experiences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <h2>Why Use Our Digital Guestbook?</h2>
          <p>Discover what makes our platform special</p>

          <div className="grid">
            <div className="card">
              <h3>Easy to Use</h3>
              <p>
                Simple and intuitive interface. Leave a message in just a few clicks.
              </p>
            </div>
            
            <div className="card">
              <h3>Purpose Categories</h3>
              <p>
                Categorize your visit with purpose tags like Student Visit, Faculty Meeting, or Campus Tour.
              </p>
            </div>
            
            <div className="card">
              <h3>Real-time Updates</h3>
              <p>
                See new messages as they're posted. Stay connected with your campus community.
              </p>
            </div>

            <div className="card">
              <h3>Secure & Private</h3>
              <p>
                Your data is protected with industry-standard security measures.
              </p>
            </div>

            <div className="card">
              <h3>Mobile Friendly</h3>
              <p>
                Access from any device. Fully responsive design for mobile and desktop.
              </p>
            </div>

            <div className="card">
              <h3>Community Focused</h3>
              <p>
                Built specifically for our college community to foster connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Leave Your Message?</h2>
          <p>
            Join hundreds of students and faculty already sharing their experiences
          </p>
          <div className="buttons">
            <Link href="/guestbook" className="btn btn-primary">
              Leave a Message
            </Link>
            <Link href="/signup" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

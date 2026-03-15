import React, { memo } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const StatisticsSection = memo(function StatisticsSection({ statistics }) {
  const defaultStats = [
    { value: 500, label: "Students Enrolled" },
    { value: 50, label: "Qualified Teachers" },
    { value: 15, label: "Years of Excellence" },
    { value: 98, label: "Success Rate" }
  ];

  const statsToUse = statistics || defaultStats;
  const [ref, inView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true,
    rootMargin: '50px'
  });

  return (
    <section className="statistics-section text-white py-4 py-md-5">
      <Container>
        <Row className="text-center g-4" ref={ref}>
          {statsToUse.map((stat, index) => (
            <Col xs={6} md={3} key={index} className="mb-3 mb-md-0">
              <h2 className="stat-number text-gold display-4 display-md-3">
                {inView ? (
                  <CountUp 
                    end={typeof stat.value === 'number' ? stat.value : parseInt(stat.value) || 0} 
                    duration={2}
                    separator=","
                    useEasing={true}
                    delay={0.2}
                  />
                ) : 0}
                {!stat.value.toString().includes('+') && !stat.value.toString().includes('K') ? '+' : ''}
              </h2>
              <p className="stat-label small small-md">{stat.label}</p>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
});

export default StatisticsSection;
CREATE DATABASE feedback_db;

USE feedback_db;

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT NOT NULL,
    submission_date DATETIME NOT NULL
);

-- Optional: Create a view for reporting
CREATE VIEW feedback_summary AS
SELECT 
    DATE(submission_date) AS submission_day,
    COUNT(*) AS total_feedback,
    AVG(rating) AS average_rating
FROM feedback
GROUP BY DATE(submission_date);
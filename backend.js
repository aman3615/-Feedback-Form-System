import java.sql.*;
import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class FeedbackServlet extends HttpServlet {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/feedback_db";
    private static final String DB_USER = "username";
    private static final String DB_PASS = "password";
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            // Parse JSON from request
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(
                new InputStreamReader(request.getInputStream()));
            
            // Extract form data
            String name = (String) json.get("name");
            String email = (String) json.get("email");
            long rating = (Long) json.get("rating");
            String comments = (String) json.get("comments");
            
            // Insert into database
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {
                String sql = "INSERT INTO feedback (name, email, rating, comments, submission_date) " +
                             "VALUES (?, ?, ?, ?, NOW())";
                
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, name);
                    stmt.setString(2, email);
                    stmt.setLong(3, rating);
                    stmt.setString(4, comments);
                    
                    int rowsAffected = stmt.executeUpdate();
                    
                    if (rowsAffected > 0) {
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.getWriter().write("Feedback saved successfully");
                    } else {
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        response.getWriter().write("Failed to save feedback");
                    }
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error: " + e.getMessage());
        }
    }
}
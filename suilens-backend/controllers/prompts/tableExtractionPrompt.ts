export const tableExtractionPrompt = (query: string, queryType: string) => {
    return `
        I need to extract all table names from the following ${queryType === "instruction" ? "natural language instruction" : "SQL query"}.
        
        ${queryType === "instruction" ? "INSTRUCTION" : "SQL QUERY"}:
        """
        ${query}
        """
        
        Your task is to extract ALL table names that might be referenced. Return only a JSON array of table names, with no additional explanation.
        
        Example responses:
        - ["users", "orders"]
        - ["employees", "departments", "salaries"]
        - []  (if no tables are identified)
        
        ${queryType === "sql" ? `
        FOR SQL QUERIES:
        - Extract tables from any part of the query (FROM, JOIN, UPDATE, INSERT INTO, DELETE FROM, etc.)
        - Consider tables in subqueries and WITH clauses
        - Ignore schema prefixes (e.g., from "schema.table" extract just "table")
        - Handle aliases (e.g., from "table AS t" extract just "table")
        
        SQL EXAMPLES:
        1. Simple query:
           "SELECT * FROM users WHERE age > 18"
           → ["users"]
        
        2. Multiple tables:
           "SELECT u.name, o.order_date FROM users u JOIN orders o ON u.id = o.user_id"
           → ["users", "orders"]
        
        3. Complex query:
           "WITH recent_orders AS (SELECT * FROM orders WHERE date > '2023-01-01')
            SELECT u.name, r.order_id FROM users u 
            LEFT JOIN recent_orders r ON u.id = r.user_id
            WHERE u.status = 'active'"
           → ["orders", "users"]
        
        4. Subqueries:
           "SELECT * FROM products WHERE category_id IN (SELECT id FROM categories WHERE active = 1)"
           → ["products", "categories"]
        
        5. Updates/Inserts:
           "UPDATE employees SET salary = salary * 1.1 WHERE department_id = 5"
           → ["employees"]` : `
        
        FOR NATURAL LANGUAGE INSTRUCTIONS:
        - Identify table names mentioned explicitly
        - Infer tables that would be needed to fulfill the request
        - Consider domain-specific entities that might be tables
        
        INSTRUCTION EXAMPLES:
        1. Simple reference:
           "Show me all users who signed up last month"
           → ["users"]
        
        2. Multiple entities:
           "List all orders with their corresponding customer details"
           → ["orders", "customers"]
        
        3. Implied relationships:
           "Show products that have been ordered more than 10 times"
           → ["products", "orders"]
        
        4. Analytical request:
           "Calculate the average salary by department"
           → ["employees", "departments"]
        
        5. Business question:
           "Who are our top 5 customers by purchase amount?"
           → ["customers", "orders"]`}
        
        Based on the ${queryType === "instruction" ? "instruction" : "SQL query"} provided, return ONLY a JSON array of table names:
        `;
};
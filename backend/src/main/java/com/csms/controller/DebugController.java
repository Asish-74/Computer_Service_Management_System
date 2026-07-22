package com.csms.controller;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DebugController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/debug/db")
    public Map<String, Object> db() throws Exception {

        Map<String, Object> map = new HashMap<>();

        try (Connection con = dataSource.getConnection()) {

            map.put("jdbcUrl", con.getMetaData().getURL());
            map.put("user", con.getMetaData().getUserName());

            Statement st = con.createStatement();

            ResultSet rs = st.executeQuery(
                    "SELECT current_database(), current_schema()");
            rs.next();

            map.put("database", rs.getString(1));
            map.put("schema", rs.getString(2));

            ResultSet rs2 = st.executeQuery("SELECT COUNT(*) FROM admin");
            rs2.next();
            map.put("adminCount", rs2.getInt(1));

            ResultSet rs3 = st.executeQuery("SELECT COUNT(*) FROM users");
            rs3.next();
            map.put("userCount", rs3.getInt(1));
            

            rs = st.executeQuery(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema='public'");

            StringBuilder tables = new StringBuilder();

            while (rs.next()) {
                tables.append(rs.getString(1)).append(", ");
            }

            map.put("tables", tables.toString());
        }

        return map;
    }
}
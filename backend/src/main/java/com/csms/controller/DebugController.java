package com.csms.controller;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/db")
    public Map<String, Object> db() throws Exception {

        Map<String, Object> map = new HashMap<>();

        try (Connection con = dataSource.getConnection()) {

            map.put("jdbcUrl", con.getMetaData().getURL());
            map.put("user", con.getMetaData().getUserName());

            Statement st = con.createStatement();

            ResultSet rs = st.executeQuery(
                    "SELECT current_database(), current_schema()");
            if (rs.next()) {
                map.put("database", rs.getString(1));
                map.put("schema", rs.getString(2));
            }

            rs = st.executeQuery("SELECT COUNT(*) FROM admin");
            if (rs.next()) {
                map.put("adminCount", rs.getInt(1));
            }

            rs = st.executeQuery("SELECT COUNT(*) FROM users");
            if (rs.next()) {
                map.put("userCount", rs.getInt(1));
            }
        }

        return map;
    }
}
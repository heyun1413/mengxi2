package com.zbwb.mengxi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class Mengxi2Application {

	public static void main(String[] args) {
		SpringApplication.run(Mengxi2Application.class, args);
	}


}

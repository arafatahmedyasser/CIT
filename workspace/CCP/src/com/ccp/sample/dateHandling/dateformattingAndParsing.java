package com.ccp.sample.dateHandling;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class dateformattingAndParsing {

	public static void main(String[] args) {
	
		String dd="25/11/2017";
		String dd1="27/11/2017";
		SimpleDateFormat sf= new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sf1= new SimpleDateFormat("E, dd-MM-yyyy hh:mm:ss a zzz");
		try {
			System.out.println(sf.parse(dd));
		
		System.out.println("------------");
		Date date=new Date(System.currentTimeMillis());
		System.out.println(dd.toString());
		
		Date rr,d1=sf.parse(dd);
		
		Date rr1,d2=sf.parse(dd1);
		
		/*System.out.println(rr.toString());
		System.out.println(rr1.toString());
		System.out.println((rr1.getTime()-rr.getTime())/(24*3600*1000));
		*/
		long diff = d2.getTime() - d1.getTime();

		long diffSeconds = diff / 1000 % 60;
		long diffMinutes = diff / (60 * 1000) % 60;
		long diffHours = diff / (60 * 60 * 1000) % 24;
		long diffDays = diff / (24 * 60 * 60 * 1000);
		
		System.out.print(diffDays + " days, ");
		System.out.print(diffHours + " hours, ");
		System.out.print(diffMinutes + " minutes, ");
		System.out.print(diffSeconds + " seconds.");

		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}

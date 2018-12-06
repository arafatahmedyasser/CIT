package com.ccp.sample.regex;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class patterncc {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		patterncc ji=new patterncc();
		Pattern hh=Pattern.compile("^(GEN|NEU|ENT)$");
		ji.gg("NEU",hh);

	}
	
	private void gg(String reg,Pattern hh){
		Matcher mm=hh.matcher(reg);	
		while(mm.find()){
			System.out.println(mm.group());
		}
		//System.out.println(mm.matches());
	}

}

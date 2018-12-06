package com.ccp.sample.filehandling;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

public class fileStreamReaderWriter1 {

	public static void main(String[] args) throws smleException {
		// TODO Auto-generated method stub
		File ff=new File("/home"+File.separator+"ahmed"+"/mysupply.txt");
		File ff1=new File("/home"+File.separator+"ahmed"+File.separator+"mysupply1.txt");
		System.out.println(ff.getAbsolutePath());
		BufferedInputStream bufferedReader=null;
		BufferedOutputStream bufferedWriter=null;
		String strFileContents=null;
		int bytesRead=0;
		try {
			bufferedReader=new BufferedInputStream(new FileInputStream(ff));
			 bufferedWriter=new BufferedOutputStream(new FileOutputStream(ff1));
			 byte contents[]=new byte[1024];
			try {
				while(bufferedReader.available()>0){
					System.out.println((char)bufferedReader.read());
				}
				if(bufferedReader!=null)
					try {
						bufferedReader.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				bufferedReader=new BufferedInputStream(new FileInputStream(ff));
				while((bytesRead=bufferedReader.read(contents))!=-1){
					bufferedWriter.write(contents, 0, bytesRead);
					  strFileContents = new String(contents, 0, bytesRead);
				      System.out.print(strFileContents);
				}

			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw new smleException(e.getMessage(), e);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new smleException(e.getMessage(), e);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new smleException(e.getMessage(), e);
		}
		finally{
			if(bufferedReader!=null)
				try {
					bufferedReader.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			if(bufferedWriter!=null)
				try {
					bufferedWriter.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}

	}

}

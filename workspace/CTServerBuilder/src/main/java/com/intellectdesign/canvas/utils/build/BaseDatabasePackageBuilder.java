/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
package com.intellectdesign.canvas.utils.build;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * This is the base class for all the database package builder
 * 
 * @Version 15.1.2
 */
public abstract class BaseDatabasePackageBuilder
{
	public static final String eol = "\r\n";

	/**
	 * Expected to return the name of the database.
	 * 
	 * @return
	 */
	public abstract String getDatabaseName();

	protected abstract HashMap<String, String> getSQLDDLMap();

	protected String getStatementTerminator()
	{
		return ";";
	}

	protected String removeExtension(String filename)
	{
		if (filename == null || !filename.contains("."))
		{
			return filename;
		}
		// Because extension is always after the last '.'
		return filename.substring(0, filename.lastIndexOf("."));
	}

	protected List<File> addFiles(List<File> files, File dir)
	{
		if (files == null)
			files = new LinkedList<File>();
		if (!dir.isDirectory())
		{
			files.add(dir);
			return files;
		} else if (dir.isDirectory()) // comment this if there is no need of directory...
		{
			files.add(dir);
		}

		String subPath;
		for (File file : dir.listFiles())
		{
			subPath = file.getAbsolutePath();
			if (!subPath.endsWith(".log") && !subPath.endsWith("Custom_scripts") && !subPath.endsWith("1.0")
					&& !subPath.endsWith("logs"))
			{
				addFiles(files, file);
			}
		}
		return files;
	}

	protected void createDirectory(String dir)
	{
		if (dir != null)
		{
			new File(dir).mkdir();
		}
	}

	protected void printUsage()
	{
		System.out.println("********************************************");
		System.out.println("This class should be run as provided below");
		System.out.println("java " + this.getClass().getName() + " <path1> <path2>");
		System.out.println("where ");
		System.out.println("<path1> is the full path to the folder that points to the Oracle scripts");
		System.out.println("<path2> is the full path to the folder that points to the " + getDatabaseName()
				+ " specific scripts");
		System.out.println("");
		System.out.println("Example usage : ");
		System.out.println("java " + this.getClass().getName()
				+ " D:/SVN_REPO/DB_Scripts/Oracle D:/SVN_REPO/DB_Scripts/" + getDatabaseName());
		System.out.println("********************************************");
	}

	protected boolean checkArgs(String[] args)
	{
		boolean valid;

		if (args != null && args.length == 2)
		{
			valid = true;
			// Check that both arguments are folders.
			File f = new File(args[0]);
			if (!f.exists() && !f.isDirectory())
			{
				valid = false;
				System.out.println(args[0] + " is not a valid directory. Please provide a valid directory");
			}
			f = new File(args[1]);
			// Try to create the target directory if not present
			if (!f.exists())
				createDirectory(f.getAbsolutePath());
			if (!f.exists() && !f.isDirectory())
			{
				valid = false;
				System.out.println(args[1] + " is not a valid directory. Please provide a valid directory");
			}
		} else
		{
			valid = false;
			System.out.println("Number of arguments provided does not match to 2. Provide the right arguments");
		}

		if (!valid)
			printUsage();
		return valid;
	}

	private StringBuilder fileContent = new StringBuilder();
	private StringBuilder fileLastContent = new StringBuilder();

	@SuppressWarnings("null")
	protected void writeNewFile(File file, String targetDirectory, String root)
	{
		try
		{
			String line = null;
			fileContent.setLength(0);
			fileLastContent.setLength(0);
			FileInputStream fr = new FileInputStream(file);
			BufferedReader br = new BufferedReader(new InputStreamReader(fr));
			String newFileName = file.getAbsolutePath().replace(root, targetDirectory);
			
			FileOutputStream fw = new FileOutputStream(newFileName);
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fw));
			HashMap<String, String> hm = new HashMap<String, String>();
			hm = getSQLDDLMap();
			
			while ((line = br.readLine()) != null)
			{
				for (Entry<String, String> entry : hm.entrySet())
				{
					String key = entry.getKey().toString();
					String value = entry.getValue().toString();
					if (!line.startsWith("--") && !(line.contains(" INDEX ") && line.contains("PK")))
					{
						line = line.replaceAll("(?i)" + key, value);
						if (line.contains(":fileLocation") && !(line.contains(".sql")))
						{
							line = line + ".sql";
						}
						line = line.replaceAll(":fileLocation", "\\$\\(current_dir\\)");
					} else if ((line.contains(" INDEX ") && line.contains("PK")) && !(line.startsWith("--")))
					{
						line = "--" + line;
					} else if (line.startsWith("--") && !line.startsWith("-- "))
					{
						line = "-- " + line;
					}
				}
				if (line.contains(":DATATYPE"))
				{
					// System.out.println("Calling line " + line);
					line = line.replaceAll(":DATATYPE", getReplaceValue(line)).replaceAll("<", "").replaceAll(">", "")
							.replaceFirst("\n", "");
				}
				if ((line.contains("INDEX") && line.contains("CREATE"))
						|| (line.contains(" UNIQUE ") && line.contains("ALTER"))
						|| (line.contains("PRIMARY KEY") && line.contains("ALTER")))
				{
					if (!line.contains("--"))
					{
						fileLastContent = fileLastContent.append(line.replace(";", getStatementTerminator()) + eol);
					} else
					{
						fileLastContent = fileLastContent.append(line + eol);
					}
				} else
				{
					bw.write(line.replace(";", getStatementTerminator()) + eol);
				}
				fileContent = fileContent.append(line.replace(";", getStatementTerminator()) + eol);
			}
			bw.write(fileLastContent.toString());
			bw.flush();
			bw.close();
			br.close();
			System.out.println("Created file - " + newFileName + " of size " + (new File(newFileName)).length());
		} catch (IOException e)
		{
			e.printStackTrace(System.err);
		}
	}

	private String getReplaceValue(String line)
	{
		String findString = (line.substring(line.indexOf("<") + 1, line.indexOf(">"))).trim();
		Pattern pattern = Pattern.compile("(?i).*[\\s]" + findString + "[\\s].*");
		Matcher matcher = pattern.matcher(fileContent.toString());

		while (matcher.find())
		{
			String temp = matcher.group().substring(matcher.group().indexOf(findString) + findString.length())
					.replace(",", "");
			if (temp.contains("DEFAULT"))
			{
				temp = temp.substring(0, temp.indexOf("DEFAULT"));
			}
			return temp;
		}
		return line;
	}

	/**
	 * Does the actual package building.
	 * 
	 * @param args
	 */
	protected void build(String[] args)
	{
		if (!checkArgs(args))
		{
			return;
		}

		File folder = new File(args[0]);
		String root = folder.getAbsolutePath();
		System.out.println("Source : " + root);
		String targetDirectory = new File(args[1]).getAbsolutePath();
		System.out.println("Target : " + targetDirectory);
		
		List<File> files = new LinkedList<File>();
		files = addFiles(files, folder);
		System.out.println("# Files to copy : " + files.size());
		for (File afile : files)
		{
			if (afile.isFile())
			{
				writeNewFile(afile, targetDirectory, root);
			} else
			{
				createDirectory(afile.toString().replace(root, targetDirectory));
			}
		}
		System.out.println("Completed for " + getDatabaseName());
	}
}

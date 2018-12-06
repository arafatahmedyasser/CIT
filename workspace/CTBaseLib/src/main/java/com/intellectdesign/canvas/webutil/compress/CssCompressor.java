/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.webutil.compress;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * This class is for CssCompressor
 * 
 * @version 1.0
 */
public class CssCompressor
{

	/**
	 * The class which parses the xml and writes the tagged jsfiles on to a file.
	 * 
	 * @param args
	 */
	public static void main(String[] paths)
	{
		String moduleName = null;
		File mergeDir = null;
		Boolean moduleFileCreated = false;
		InputStream inputStream = null;
		OutputStreamWriter writer = null;
		String content = null;
		StringBuffer jsContent = new StringBuffer();
		try
		{
			System.out.println(" CssCompressor Started Merging the files");

			inputStream = new FileInputStream(paths[0] + "/CTRIAFramework/UIArena/theme/system/cssconfig.xml");
			DocumentBuilderFactory docBldrFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBldr = docBldrFactory.newDocumentBuilder();
			Document doc;

			doc = docBldr.parse(inputStream);

			NodeList fileListNodes = doc.getChildNodes().item(0).getChildNodes();
			for (int flCount = 0; flCount < fileListNodes.getLength(); flCount++)
			{
				Node flNode = fileListNodes.item(flCount);

				if ("theme".equals(flNode.getNodeName()))
				{
					String folderRef = flNode.getAttributes().getNamedItem("folderRef").getNodeValue();
					NamedNodeMap namedNodeMap = flNode.getAttributes();
					Node idAttr = namedNodeMap.getNamedItem("id");
					moduleName = namedNodeMap.getNamedItem("mode").getNodeValue() + "-" + idAttr.getNodeValue();
					String mergePath = paths[0] + folderRef;
					String actualPath = paths[1] + folderRef;
					System.out.println(" mergePath" + mergePath);
					System.out.println(" actualPath" + actualPath);
					mergeDir = new File(mergePath);
					mergeDir.mkdir();
					File compressedJs = new File(mergePath + "/" + moduleName.toString() + ".css");
					if (compressedJs.isFile() && compressedJs.exists())
					{
						compressedJs.delete();
					}
					moduleFileCreated = compressedJs.createNewFile();
					NodeList urlNodes = flNode.getChildNodes();
					for (int urlCount = 0; urlCount < urlNodes.getLength(); urlCount++)
					{
						Node jsNode = urlNodes.item(urlCount);
						if ("css".equals(jsNode.getNodeName()))
						{
							String js = actualPath
									+ jsNode.getAttributes().getNamedItem("name").getNodeValue().toString();
							File originalJs = new File(js);
							if (originalJs.exists() && originalJs.isFile() && moduleFileCreated == true)
							{
								content = FileUtils.readFileToString(originalJs);
								jsContent.append(content);
								jsContent.append(System.getProperty("line.separator"));
							}
						}
					}
					writer = new OutputStreamWriter(new FileOutputStream(compressedJs, true), "UTF-8");
					BufferedWriter fbw = new BufferedWriter(writer);
					fbw.write(jsContent.toString());
					fbw.close();
					jsContent.setLength(0);

					File minifiedJs = new File(mergePath + "/" + moduleName.toString() + "-compress.css");
					if (minifiedJs.isFile() && minifiedJs.exists())
					{
						minifiedJs.delete();
					}
					
					
					CompressCss(compressedJs,minifiedJs);
					
				}
			}
		} catch (SAXException SAXe)
		{
			System.out.println("A SAX parser exception has occured while closing the Output stream writer" + SAXe);
			SAXe.printStackTrace();
		} catch (IOException IOe)
		{
			System.out.println("An IO exception has occured while closing the Output stream writer" + IOe);
			IOe.printStackTrace();
		} catch (ParserConfigurationException pce)
		{
			System.out.println("A ParserConfigurationException has occured while closing the Output stream writer"
					+ pce);
			pce.printStackTrace();
		} finally
		{
			try
			{
				if (inputStream != null)
					inputStream.close();
			} catch (IOException IOe)
			{
				System.out.println("An IO exception occured while closing the input stream " + IOe);
				IOe.printStackTrace();
			}
			try
			{
				if (writer != null)
					writer.close();
			} catch (IOException IOe)
			{
				System.out.println("An IO exception occured while closing the Output stream writer" + IOe);
				IOe.printStackTrace();
			}
		}
		System.out.println("The files have been merged Successfully");
	}
	

	/**
	 * This metod is used CompressCss
	 * 
	 * @param inputFilename
	 * @param outputFilename
	 * @param o
	 * @throws IOException
	 */

	
	public static void CompressCss(File inputFilename, File outputFilename) throws IOException
	{
		Reader in = null;
		Writer out = null;
		try
		{
			in = new InputStreamReader(new FileInputStream(inputFilename), "UTF-8");

			com.yahoo.platform.yui.compressor.CssCompressor compressor = new com.yahoo.platform.yui.compressor.CssCompressor(in);
			in.close();
			in = null;

			out = new OutputStreamWriter(new FileOutputStream(outputFilename), "UTF-8");
			compressor.compress(out, -1);
		} finally
		{
			IOUtils.closeQuietly(in);
			IOUtils.closeQuietly(out);
		}
	}
	
}

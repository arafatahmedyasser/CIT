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

package com.intellectdesign.canvas.reports.generator;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ResourceBundle;
import java.util.StringTokenizer;

import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.fop.apps.FOPException;
import org.apache.fop.apps.FOUserAgent;
import org.apache.fop.apps.Fop;
import org.apache.fop.apps.FopFactory;
import org.apache.fop.apps.MimeConstants;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.exportdata.IExportDataValueObject;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.reports.ReportXMLBuilderForm;

/**
 * This class is used to generate confirmation pdf document from the given data. This will call method of
 * ReportXMLBuilderForm to build the xml file and using the xsl file secified pdf document is generated using fop api's.
 * 
 * @version 1.0
 */
public class PDFFormGenerator
{
	private static final Logger logger = Logger.getLogger(PDFFormGenerator.class);

	/**
	 * This method generates pdf document from the given data. This will call method of ReportXMLBuilderForm to build
	 * the xml file and using the xsl file secified pdf document is generated using fop api's.
	 * 
	 * @param IExportDataValueObject
	 * @param pdfPath
	 * @param product
	 * @param userValue
	 * @param subProduct
	 * @param function
	 * @returns boolean
	 * @exception FileNotFoundException
	 * @exception FOPException
	 * @exception TransformerConfigurationException
	 * @exception TransformerException
	 * @exception IOException
	 */
	public boolean generatePDFDocument(IExportDataValueObject dataValueObject, String pdfPath, UserValue userValue,
			String product, String subProduct, String function)
	{
		String cmName = "PDFFormGenerator:generatePDFDocument";
		logger.ctinfo("CTEXP00026", cmName);
		OutputStream out = null;
		String xsltPath = null;

		try
		{
			// Completee xml file path will be formed .
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
			String xmlPath = exportDescriptor.getXmlFolderPath() + File.separator
					+ pdfPath.substring(0, pdfPath.lastIndexOf(".")) + ".xml";
			logger.ctdebug("CTEXP00114", xmlPath);
			// Complete pdf file path will be formed .
			String pdfFullPath = exportDescriptor.getPdfFolderPath() + File.separator + pdfPath;
			logger.ctdebug("CTEXP00115", pdfFullPath);

			// getXslFile method is called to get path of xsl file to be used .
			xsltPath = getXslFile(product, subProduct, function);
			// calls renderReportXML method of ReportXMLBuilderForm to build the xml file .
			ReportXMLBuilderForm rxb = new ReportXMLBuilderForm();
			rxb.renderReportXML(dataValueObject, xmlPath, userValue);
			FopFactory fopFactory = FopFactory.newInstance();
			// Using fop generates the pdf file
			FOUserAgent foUserAgent = fopFactory.newFOUserAgent();
			// creates new BufferedOutputStream to create pdf document
			out = new java.io.BufferedOutputStream(new java.io.FileOutputStream(pdfFullPath));
			Fop fop;
			fop = fopFactory.newFop(MimeConstants.MIME_PDF, foUserAgent, out);
			TransformerFactory factory = TransformerFactory.newInstance();
			Transformer transformer = null;
			transformer = factory.newTransformer(new StreamSource(new File(xsltPath)));
			Source src = new StreamSource(new File(xmlPath));
			Result res = new SAXResult(fop.getDefaultHandler());
			transformer.transform(src, res);
			// destroys the xml file created .
			new File(xmlPath).delete();
			// destroys the xsl file created .
			new File(xsltPath).delete();
			return true;
		} catch (FileNotFoundException e)
		{
			logger.cterror("CTEXP00038", e);
			return false;
		} catch (FOPException e)
		{
			logger.cterror("CTEXP00038", e);
			return false;
		} catch (TransformerConfigurationException e)
		{
			logger.cterror("CTEXP00038", e);
			return false;
		} catch (TransformerException e)
		{
			logger.cterror("CTEXP00038", e);
			return false;
		} catch (IOException e)
		{
			logger.cterror("CTEXP00038", e);
			return false;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			return false;
		} finally
		{
			try
			{
				if (out != null)
					out.close();
			} catch (IOException e)
			{
			}
			new File(xsltPath).delete();
		}
	}

	/**
	 * getXslFile method is called to get path of xsl file to be used.
	 * 
	 * @param product
	 * @param subProduct
	 * @param function
	 * @returns String
	 * 
	 * @throws IOException
	 */

	private String getXslFile(String product, String subProduct, String function) throws IOException
	{
		String txnTemplatepath;
		String cmName = "PDFFormGenerator:getXslFile";
		ResourceBundle report = ResourceBundle.getBundle("reporting");

		// gets path of txn templete to be used checks for funtion,subproduct and product level templets.
		if (report.containsKey("TXN_TEMPLATE_" + product + "_" + subProduct + "_" + function + "_PATH"))
			txnTemplatepath = report.getString("TXN_TEMPLATE_" + product + "_" + subProduct + "_" + function + "_PATH");
		else if (report.containsKey("TXN_TEMPLATE_" + product + "_" + subProduct + "_PATH"))
			txnTemplatepath = report.getString("TXN_TEMPLATE_" + product + "_" + subProduct + "_PATH");
		else if (report.containsKey("TXN_TEMPLATE_" + product + "_PATH"))
			txnTemplatepath = report.getString("TXN_TEMPLATE_" + product + "_PATH");
		else
			txnTemplatepath = report.getString("TXN_TEMPLATE_PATH");

		logger.ctdebug("CTEXP00116", txnTemplatepath);

		File xsltFile = new File(report.getString("XSL_FORM_PATH"));
		// Deletes the out put xsl file if already exists
		if (xsltFile.exists())
		{
			if (xsltFile.isFile())
				xsltFile.delete();
		}
		// creates FileOutputStream to create new xsl file
		OutputStream out = new FileOutputStream(xsltFile, true);
		// gets template printing order
		String printingOrder = report.getString("PRINT_CONFIRMATION_TEMPLATES");

		// Gets all the templetes to be added as string array
		String[] printItems = getDelimatedValues(printingOrder, ",");

		if (printItems != null)
		{
			for (int i = 0; i < printItems.length; i++)
			{
				String item = printItems[i];
				if (item.equalsIgnoreCase("TRANS_DATA"))
				{
					// if templete name is TRANS_DATA then it first adds default templete and the checks for
					// funtion,subproduct and product level templets.
					writeToFile(out, report.getString("TXN_TEMPLATE_PATH"));
					if (txnTemplatepath.equalsIgnoreCase(report.getString("TXN_TEMPLATE_PATH")))
					{
					} else
					{
						writeToFile(out, txnTemplatepath);
					}
				} else
				{
					writeToFile(out, report.getString(item));
				}
			}
		}

		out.close();
		return report.getString("XSL_FORM_PATH");
	}

	/**
	 * This method will return array osf strings when a string and its delimiter are provided
	 * 
	 * @param value
	 * @param delimiter
	 * @returns String[]
	 */

	private String[] getDelimatedValues(String value, String delimiter)
	{
		StringTokenizer st = new StringTokenizer(value, delimiter);
		String returnVals[] = new String[st.countTokens()];
		int index = 0;

		while (st.hasMoreElements())
		{
			returnVals[index++] = (String) st.nextElement();
		}
		return returnVals;
	}

	/**
	 * This method will write contents from the file in given path to th given outputstream
	 * 
	 * @param out
	 * @param filePath
	 * 
	 * @returns void
	 * @throws IOException
	 */
	private void writeToFile(OutputStream out, String filePath) throws IOException
	{
		File f1 = new File(filePath);
		InputStream in = new FileInputStream(f1);
		byte[] buf = new byte[1024];

		int lenght;
		while ((lenght = in.read(buf)) > 0)
		{
			out.write(buf, 0, lenght);
		}
		in.close();
	}
}

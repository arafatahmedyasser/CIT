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
 */

package com.intellectdesign.canvas.report.publisher;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.Map;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * This class is responsible for publishing the generated report in Archieved folder.
 * 
 * @version 1.0
 */

public class ArcFolderReportPublisher implements IReportPublisher
{
	/**
	 * This method is intended to get response from reportResponse object and publish the report from source to
	 * destination. Source is obtained from reportResponse object and destination is set by obtaining path from property
	 * file and creating folder structure as filepath->gcif->userno->reportname. 1. Create the destination path if not
	 * available 2. Copy the report from source to destination
	 * 
	 * @param reportResponse ReportResponse : returns reportResponse object.
	 * @throws ReportingException e
	 */
	public void publish(ReportResponse reportResponse) throws ReportingException
	{
		logger.ctinfo("CTREP00417");
		try
		{
			Map response = reportResponse.getResponseObject();
			String sourcepath = (String) response.get(ReportConstants.REPORT_REF_LOCATION);
			String gcif = (String) response.get(ReportConstants.OD_GCIF);
			String userno = (String) response.get(ReportConstants.OD_USER_NO);
			ConfigurationManager config = ConfigurationManager.getInstance();
			String archievedFilePath = config.getInformationReportingDescriptor().getReportArchievedPath();
			File srcFile = new File(sourcepath);
			String format = (String) response.get(ReportConstants.FORMAT_ID);

			String qualifiedReportName = reportResponse.getReportName() + "_" + reportResponse.getReportInstanceId()
					+ '.' + format.toLowerCase();

			// 1. Create the destination path if not available
			String destpath = checkFilePath(archievedFilePath, gcif, userno);
			destpath = destpath + File.separator + qualifiedReportName;
			File destFile = new File(destpath);
			// 2. Copy the report from source to destination
			copyFile(srcFile, destFile);
		} catch (ReportingException e)
		{
			logger.cterror("CTREP00418", e);
			throw e;
		} catch (Exception e)
		{
			logger.cterror("CTREP00419", e);
			throw new ReportingException(ReportConstants.ERR_REP_PUB, e);

		}
		logger.ctinfo("CTREP00420");
	}

	/**
	 * This method is intended to copy report from source to destination.
	 * 
	 * @param sourceFile File : contains path of the source from where report is to be copied.
	 * @param destFile File : contains path of the destination where report is to be copied.
	 * @throws ReportingException e
	 */
	private void copyFile(File sourceFile, File destFile) throws ReportingException
	{
		try
		{
			logger.ctinfo("CTREP00421");
			boolean hasNewFileCreated = true;
			if (!sourceFile.exists())
			{
				return;
			}
			if (!destFile.exists())
			{
				hasNewFileCreated = destFile.createNewFile();
			}

			if (hasNewFileCreated)
			{
				FileChannel source = null;
				FileChannel destination = null;
				source = new FileInputStream(sourceFile).getChannel();
				destination = new FileOutputStream(destFile).getChannel();
				if (destination != null && source != null)
				{
					destination.transferFrom(source, 0, source.size());
				}
				if (source != null)
				{
					source.close();
				}
				if (destination != null)
				{
					destination.close();
				}
			} else
			{
				logger.cterror("CTREP00422", destFile);
				throw new ReportingException(ReportConstants.ERR_REP_EXP);

			}
		} catch (FileNotFoundException e)
		{
			logger.cterror("CTREP00423", e);
			throw new ReportingException(ReportConstants.ERR_REP_FNF, e);
		} catch (ArrayIndexOutOfBoundsException e)
		{
			logger.cterror("CTREP00424", e);
			throw new ReportingException(ReportConstants.ERR_REP_AIOB, e);
		} catch (IOException e)
		{
			logger.cterror("CTREP00425", e);
			throw new ReportingException(ReportConstants.ERR_REP_IOE, e);
		} catch (Exception e)
		{
			logger.cterror("CTREP00426", e);
			throw new ReportingException(ReportConstants.ERR_REP_EXP, e);
		}
		logger.ctinfo("CTREP00427");
	}

	/**
	 * This method is intended to check the availability of the filepth. If the filepath does not exist, it will create
	 * the same.
	 * 
	 * @param filePath String : contains the destination path of the report read from ReportingFW.properties
	 * @param gcif String
	 * @param userno String
	 * @return dpath : return the destination path where report has to be published
	 * @throws Exception ex
	 * @throws ReportingException ex
	 */
	private String checkFilePath(String filePath, String gcif, String userno) throws ReportingException
	{
		logger.ctinfo("CTREP00428");
		StringBuffer newFileName = new StringBuffer();
		boolean flag = false;
		try
		{
			newFileName.append(filePath);
			newFileName.append((File.separator));
			newFileName.append(gcif);
			newFileName.append((File.separator));
			newFileName.append(userno);
			File dirCheck = new File(newFileName.toString());
			// To check whether the destination path exists
			flag = dirCheck.exists();
			// To create destination path if it doesnot exist
			if (!flag)
			{
				flag = new File(newFileName.toString()).mkdirs();
			}
			logger.ctdebug("CTREP00429", newFileName.toString());
		} catch (Exception ex)
		{
			logger.cterror("CTREP00430", ex, newFileName);
			throw new ReportingException(ex.getMessage());
		}
		String dpath = null;
		if (flag)
		{
			dpath = newFileName.toString();
		} else
		{
			dpath = filePath;
		}
		logger.ctinfo("CTREP00431");
		return dpath;
	}

	// instatiating the logger object.
	private static Logger logger = Logger.getLogger(ArcFolderReportPublisher.class);
}

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

package com.intellectdesign.canvas.exportdata;

import java.io.File;
import java.util.HashMap;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.reports.generator.OFXGenerator;
import com.intellectdesign.canvas.utility.CTUtility;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This class is responsible to generate the OFX document.
 * 
 * @version 1.0
 */
public class ExportOFXFormatProvider implements IExportFormFormatProvider
{

	/**
	 * This method calls the OFXGenerator to export the document in ofx format
	 * 
	 * @param IExportFormDataValueObject exportDataVO : hold the export data
	 * @param UserValue userValue: Holds the users related information.
	 * @return path of the file
	 * @throws ExportDataException
	 */

	/** Paramter changed from type IExportFormDataValueObject to FormExportDataObject */
	public String getExportFormFormat(FormExportDataObject exportDataVO, IUserValue userValue)
			throws ExportDataException
	{
		String cmName = "[ExportOFXFormatProvider.getExportFormFormat]";
		HashMap hmResultMap = new HashMap();
		String sFilePath = null;
		String sUserId = null;

		logger.ctinfo("CTEXP00014", cmName, exportDataVO);
		sUserId = userValue.getUserNo();
		hmResultMap.put(ExportFwsConstants.CORPORATE_NAME, userValue.getPrimaryCorporate());
		hmResultMap.put(ExportFwsConstants.USER_NAME, userValue.getFIRST_NAME());
		hmResultMap.put(ExportFwsConstants.LANGUAGE_ID, userValue.getLangId());
		hmResultMap.put(ExportFwsConstants.USER_AMOUNT_FORMAT, userValue.getmAmtFormat());
		hmResultMap.put(ExportFwsConstants.FORM_DATA, exportDataVO.getFormData());
		hmResultMap.put(ExportFwsConstants.EXPORT_GRID_DATA, exportDataVO.getGridData());
		logger.ctdebug("CTEXP00025", hmResultMap);

		sFilePath = generateDocument(hmResultMap, sUserId);
		logger.ctinfo("CTEXP00027", cmName);
		return sFilePath;
	}

	/**
	 * API to generate the OFX document. This method will in turn call another method that will do the creation of the
	 * document and also the rendering the export data.
	 * 
	 * @param: hmResultMap: HashMap that hold the export data and othere information required to generate the export.
	 * @param: String userNo: user no
	 * @return: String sFilePath: instance of the ofx document.
	 * @exception ExportDataException
	 * */
	private String generateDocument(HashMap hmResultMap, String userNo) throws ExportDataException
	{
		String cmName = "[ExportOFXFormatProvider.generateDocument]";
		String sFilePath = null;
		logger.ctinfo("CTEXP00012", cmName, hmResultMap);
		OFXGenerator ofxGenerator = new OFXGenerator();
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

		try
		{

			String strOFXFolderPath = exportDescriptor.getOfxFolderPath();

			sFilePath = strOFXFolderPath + File.separator + userNo + "_" + CTUtility.getDateTime() + ".ofx";
			logger.ctdebug("CTEXP00185", cmName, hmResultMap, sFilePath);
			ofxGenerator.generateOFXDocument(hmResultMap, sFilePath, true);
		} catch (Exception exception)
		{
			logger.cterror("CTEXP00028", exception);
			throw new ExportDataException("Exception occured while generating OFX ", exception);
		}
		logger.ctinfo("CTEXP00027", cmName);
		return sFilePath;
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(ExportOFXFormatProvider.class);
}

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
package com.intellectdesign.canvas.config;

import java.util.PropertyResourceBundle;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This class contains the export configuration
 * 
 * @version 1.0
 */
public class ExportConfigurationDescriptor extends PropertyBagConfigurationDescriptor
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 1L;
	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(
			SecurityConfigurationDescriptor.class);

	private String xmlFolderPath = null;
	private String xslFolderPath = null;
	private String pdfFolderPath = null;
	private String ofxFolderPath = null;
	private String rtfFolderPath = null;
	private String xsltPath = null;
	private String detailXsltPath = null;
	private String xsltRtlPath = null;
	private String detailXsltRtlPath = null;
	private String fopConfigPath = null;
	private String intellectLogo = null;
	private String xslImagePath = null;
	private String fileDown = null;
	private String xmlPrintPath = null;
	private String htmlFolderPath = null;
	private String csvFolderPath = null;
	private String fontPath = null;

	private String arabicMetricFontPath1 = null;
	private String arabicembededFontPath1 = null;
	private String arabicMetricFontPath2 = null;
	private String arabicembededFontPath2 = null;

	private String pageTitle = null;

	private String orgPDFPath = null;
	private String chartGeneratedImgPath = null;

	private String sessionTimeOutURL = null;
	private String contextPath = null;
	private String errorTitle = null;
	private String okButtonLabel = null;
	private String reference = null;
	private String sysError = null;

	private String formPDFFilePath = null;
	private String formHTMLFilePath = null;
	private String exportFooterText = null;
	private String ltrFontFormExport = null;
	private String themebackgroundcolor = null;
	private String rtlFontFormExport = null;	
	

	private boolean searchResultExportReqd = true;

	/**
	 * ref to Str XmlFolderPath
	 * 
	 * @return the xmlFolderPath
	 */
	public String getXmlFolderPath()
	{
		return xmlFolderPath;
	}

	/**
	 * ref to Str XslFolderPath
	 * 
	 * @return the xslFolderPath
	 */
	public String getXslFolderPath()
	{
		return xslFolderPath;
	}

	/**
	 * ref to pdfFolderPath
	 * 
	 * @return the pdfFolderPath
	 */
	public String getPdfFolderPath()
	{
		return pdfFolderPath;
	}

	/**
	 * ref to Str OfXFolderPath
	 * 
	 * @return the ofxFolderPath
	 */
	public String getOfxFolderPath()
	{
		return ofxFolderPath;
	}

	/**
	 * ref to Str RTFFolder
	 * 
	 * @return the rtfFolderPath
	 */
	public String getRtfFolderPath()
	{
		return rtfFolderPath;
	}

	/**
	 * ref to xsltPath
	 * 
	 * @return the xslt_Path
	 */
	public String getXsltPath()
	{
		return xsltPath;
	}

	/**
	 * ref to deatilXslpath
	 * 
	 * @return the detailXsltPath
	 */
	public String getDetailXsltPath()
	{
		return detailXsltPath;
	}

	/**
	 * ref to xsltRtlPath
	 * 
	 * @return the xsltRtlPath
	 */
	public String getXsltRtlPath()
	{
		return xsltRtlPath;
	}

	/**
	 * ref to DetailXsltRtlPath
	 * 
	 * @return the detailXsltRtlPath
	 */
	public String getDetailXsltRtlPath()
	{
		return detailXsltRtlPath;
	}

	/**
	 * ref to fopConfigPath
	 * 
	 * @return the fopConfigPath
	 */
	public String getFopConfigPath()
	{
		return fopConfigPath;
	}

	/**
	 * ref to IntellectLogo
	 * 
	 * @return the intellectLogo
	 */
	public String getIntellectLogo()
	{
		return intellectLogo;
	}

	/**
	 * ref to xslImagPath
	 * 
	 * @return the xslImagePath
	 */
	public String getXslImagePath()
	{
		return xslImagePath;
	}

	/**
	 * ref to FileDown
	 * 
	 * @return the fileDown
	 */
	public String getFileDown()
	{
		return fileDown;
	}

	/**
	 * ref to XMLPrintPath
	 * 
	 * @return the xmlPrintPath
	 */
	public String getXmlPrintPath()
	{
		return xmlPrintPath;
	}

	/**
	 * ref to HtmlfolderPath
	 * 
	 * @return the htmlFolderPath
	 */
	public String getHtmlFolderPath()
	{
		return htmlFolderPath;
	}

	/**
	 * ref too CSVFolderPath
	 * 
	 * @return the csvFolderPath
	 */
	public String getCsvFolderPath()
	{
		return csvFolderPath;
	}

	/**
	 * ref to FontPath
	 * 
	 * @return the fontPath
	 */
	public String getFontPath()
	{
		return fontPath;
	}

	/**
	 * ref to ArabicMetricFontPath1
	 * 
	 * @return the arabicMetricFontPath1
	 */
	public String getArabicMetricFontPath1()
	{
		return arabicMetricFontPath1;
	}

	/**
	 * ref to arabicembededFontPath1
	 * 
	 * @return the arabicembededFontPath1
	 */
	public String getArabicembededFontPath1()
	{
		return arabicembededFontPath1;
	}

	/**
	 * ref to arabicMetricFontPath2
	 * 
	 * @return the arabicMetricFontPath2
	 */
	public String getArabicMetricFontPath2()
	{
		return arabicMetricFontPath2;
	}

	/**
	 * ref to arabicembededFontPath2
	 * 
	 * @return the arabicembededFontPath2
	 */
	public String getArabicembededFontPath2()
	{
		return arabicembededFontPath2;
	}

	/**
	 * ref to ExportConfigurationDescriptor
	 * 
	 * @param name
	 */
	public ExportConfigurationDescriptor(String name)
	{
		super(name);
	}

	/**
	 * ref to PageTitle
	 * 
	 * @return the pageTitle
	 */
	public String getPageTitle()
	{
		return pageTitle;
	}

	/**
	 * ref to OrgPDFPath
	 * 
	 * @return the orgPDFPath
	 */
	public String getOrgPDFPath()
	{
		return orgPDFPath;
	}

	/**
	 * ref to chartGeneratedImgPath
	 * 
	 * @return the chartGeneratedImgPath
	 */
	public String getChartGeneratedImgPath()
	{
		return chartGeneratedImgPath;
	}

	/**
	 * ref to sessionTimeOutURL
	 * 
	 * @return the sessionTimeOutURL
	 */
	public String getSessionTimeOutURL()
	{
		return sessionTimeOutURL;
	}

	/**
	 * ref to contextPath
	 * 
	 * @return the contextPath
	 */
	public String getContextPath()
	{
		return contextPath;
	}

	/**
	 * ref to ErrorTitle
	 * 
	 * @return the errorTitle
	 */
	public String getErrorTitle()
	{
		return errorTitle;
	}

	/**
	 * ref to okButtonLabel
	 * 
	 * @return the okButtonLabel
	 */
	public String getOkButtonLabel()
	{
		return okButtonLabel;
	}

	/**
	 * ref to reference
	 * 
	 * @return the reference
	 */
	public String getReference()
	{
		return reference;
	}

	/**
	 * ref to SysError
	 * 
	 * @return the sysError
	 */
	public String getSysError()
	{
		return sysError;
	}

	/**
	 * ref to formPDFFilePath
	 * 
	 * @return the formPDFFilePath
	 */
	public String getFormPDFFilePath()
	{
		return formPDFFilePath;
	}

	/**
	 * ref to formHTMLFilePath
	 * 
	 * @return the formPDFFilePath
	 */
	public String getFormHTMLFilePath()
	{
		return formHTMLFilePath;
	}

	/**
	 * ref to exportFooterText
	 * 
	 * @return the exportFooterText
	 */
	public String getExportFooterText()
	{
		return exportFooterText;
	}

	/**
	 * ref to searchResultExportReqd
	 * 
	 * @return the searchResultExportReqd
	 */
	public boolean isSearchResultExportReqd()
	{
		return searchResultExportReqd;
	}

	/**
	 * ref to get ltr font
	 * 
	 * @return the ltr font
	 */
	public String getLtrfont()
	{
		return ltrFontFormExport;
	}
	
	/**
	 * ref to get rtl font
	 * 
	 * @return the rtl font
	 */
	public String getRtlfont()
	{
		return rtlFontFormExport;
	}
	/**
	 * ref to get theme color
	 * 
	 * @return the theme color
	 */
	public String getThemeColor()
	{
		return themebackgroundcolor;
	}
	/**
	 * ref to LoadConfig
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#loadConfiguration(java.lang.String)
	 */
	@Override
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{
		super.loadConfiguration(configSource, defaultDescriptor);
		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the Export configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();

		xmlFolderPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "XML_FOLDER_PATH", "");
		xslFolderPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "XSL_FOLDER_PATH", "");
		pdfFolderPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "PDF_FOLDER_PATH", "");
		ofxFolderPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "OFX_FOLDER_PATH", "");
		rtfFolderPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "RTF_FOLDER_PATH", "");
		xsltPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "XSLT_PATH", "");
		xsltRtlPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "XSLT_RTL_PATH", "");
		detailXsltPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "DETAIL_XSLT_PATH", "");
		detailXsltRtlPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "DETAIL_XSLT_RTL_PATH", "");
		fopConfigPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "FOP_USERCONFIG_PATH", "");
		intellectLogo = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "APPLICATION_LOGO", "");
		xslImagePath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "XSL_IMAGE_PATH", "");
		fileDown = ResourceBundleUtils.getString(bundle, "FILE_DOWNL", "");
		xmlPrintPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "XML_PRINT_PATH", "");
		htmlFolderPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "HTML_FOLDER_PATH", "");
		csvFolderPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "CSV_FOLDER_PATH", "");
		fontPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "FONT_PATH", "");
		arabicMetricFontPath1 = getWorkFolderPath()
				+ ResourceBundleUtils.getString(bundle, "ARABIC_METRIC_FONT_PATH1", "");
		arabicembededFontPath1 = getWorkFolderPath()
				+ ResourceBundleUtils.getString(bundle, "ARABIC_EMBEDED_FONT_PATH1", "");
		arabicMetricFontPath2 = getWorkFolderPath()
				+ ResourceBundleUtils.getString(bundle, "ARABIC_METRIC_FONT_PATH2", "");
		arabicembededFontPath2 = getWorkFolderPath()
				+ ResourceBundleUtils.getString(bundle, "ARABIC_EMBEDED_FONT_PATH2", "");

		pageTitle = ResourceBundleUtils.getString(bundle, "PAGE_TITLE", "");
		orgPDFPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "ORG_PDF_FILE_PATH", "");
		chartGeneratedImgPath = getWorkFolderPath()
				+ ResourceBundleUtils.getString(bundle, "CHART_IMAGE_FILE_PATH", "");

		sessionTimeOutURL = ResourceBundleUtils.getString(bundle, "SESSION_TIMEOUT_URL", "");
		contextPath = ResourceBundleUtils.getString(bundle, "CONTEXT_PATH", "");
		errorTitle = ResourceBundleUtils.getString(bundle, "LBL_ERROR_TITLE", "");
		okButtonLabel = ResourceBundleUtils.getString(bundle, "LBL_OK_BTN", "");
		reference = ResourceBundleUtils.getString(bundle, "LBL_REFERENCE", "");
		sysError = ResourceBundleUtils.getString(bundle, "SYSERROR", "");
		formPDFFilePath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "FORM_PDF_FILE_PATH", "");
		formHTMLFilePath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "FORM_HTML_FILE_PATH", "");
		exportFooterText = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "EXPORT_FOOTER_TEXT", "");
		searchResultExportReqd = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"SEARCH_RESULT_EXPORT_REQD", "Y"));
		ltrFontFormExport = ResourceBundleUtils.getString(bundle, "LTR_FONT_FOR_FORM_EXPORT", "");
		rtlFontFormExport = ResourceBundleUtils.getString(bundle, "RTL_FONT_FOR_FORM_EXPORT", "");	
		themebackgroundcolor = ResourceBundleUtils.getString(bundle, "THEME_BACKGROUND_COLOR", "");
	}

	/**
	 * Helper method that validates a configuration before loading the same.
	 * 
	 */
	private boolean isValidConfiguration()
	{
		PerformanceTimer timer = new PerformanceTimer();
		boolean validationStatus = true;
		StringBuilder errorBuilder = new StringBuilder();
		LOGGER.ctdebug("CTCOM00010");
		timer.startTimer(getClass(), "isValidConfiguration");

		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();
		errorBuilder.append(validator.validatePathConfig("XML_FOLDER_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("XSL_FOLDER_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("PDF_FOLDER_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("OFX_FOLDER_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("RTF_FOLDER_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validateFileExists("XSLT_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validateFileExists("DETAIL_XSLT_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validateFileExists("XSLT_RTL_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validateFileExists("DETAIL_XSLT_RTL_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validateFileExists("FOP_USERCONFIG_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validateFileExists("APPLICATION_LOGO", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validateFileExists("XSL_IMAGE_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("FONT_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("HTML_FOLDER_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("CSV_FOLDER_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("XML_PRINT_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("ORG_PDF_FILE_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("CHART_IMAGE_FILE_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("FORM_PDF_FILE_PATH", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validatePathConfig("FORM_HTML_FILE_PATH", bundle, getWorkFolderPath()));

		errorBuilder.append(validator.validateConfig("FILE_DOWNL", bundle));
		errorBuilder.append(validator.validateConfig("SESSION_TIMEOUT_URL", bundle));
		errorBuilder.append(validator.validateConfig("CONTEXT_PATH", bundle));
		errorBuilder.append(validator.validateConfig("EXPORT_FOOTER_TEXT", bundle));
		errorBuilder.append(validator.validateConfig("PAGE_TITLE", bundle));
		errorBuilder.append(validator.validateConfig("LBL_ERROR_TITLE", bundle));
		errorBuilder.append(validator.validateConfig("LBL_OK_BTN", bundle));
		errorBuilder.append(validator.validateConfig("LBL_REFERENCE", bundle));
		errorBuilder.append(validator.validateConfig("SYSERROR", bundle));		
		errorBuilder.append(validator.validateConfig("LTR_FONT_FOR_FORM_EXPORT", bundle));
		errorBuilder.append(validator.validateConfig("RTL_FONT_FOR_FORM_EXPORT", bundle));
		
		errorBuilder.append(validator.validateIndicators("SEARCH_RESULT_EXPORT_REQD", bundle));

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00011");
		else
		{
			LOGGER.cterror("CTCOM00012", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}

}

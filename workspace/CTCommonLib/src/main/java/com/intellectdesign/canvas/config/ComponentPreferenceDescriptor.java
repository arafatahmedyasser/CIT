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
 * This class defines the preferences of the component
 * 
 * @version 1.0
 */
public class ComponentPreferenceDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 5942368370769666566L;

	public static final String MAIN_CONFIG_CT_WEBUTIL = "CT_WEBUTIL_BUNDLE";

	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(
			ComponentPreferenceDescriptor.class);

	private String fileUploadTempFolderPath = null;

	private String maximumFileSize = null;

	private boolean enableLayoutResize = false;

	private boolean enableAppDrag = false;

	private boolean responsiveGridInd = false;

	private String responsiveWidth = null;

	private String dateColumnAlignent = "LEFT";

	private String amountColumnAlignent = "LEFT";

	private String dateTimeColumnAlignent = "LEFT";

	private String userImageUploadPath = null;

	private String userImageSize = null;

	private String userImageSupportedFormats = null;

	private String googleMapUri = null;

	private String googleMapZoom = null;

	private String listViewPageSize = null;

	private String searchResultExportInd = null;

	private String defaultRecordsPerPage = null;

	private String defaultPagesDisplay = null;

	private String actionBtnOrder = null;

	private String ctTemplatesRelativeURL = null;

	private int minWgtHeight = 0;
	private int maxWgtHeight = 0;
	private boolean contextMsgEnable = false;
	private int defaultPageSizeForMobile = 0;

	private boolean launchLookUpWithOneRecord = false;

	private boolean negativeSignInAmountColumn = true;

	private String copyRightMsg = null;

	/**
	 * This method is used to get the copy right details
	 * 
	 * @return the copy right message
	 */
	public String getCopyRightMsg()
	{
		return copyRightMsg;
	}

	public String getActionButtonOrder()
	{
		return actionBtnOrder;
	}

	/**
	 * ref to ComponentPreferenceDescriptor
	 * 
	 * @param name
	 */
	public ComponentPreferenceDescriptor(String name)
	{
		super(name);
	}

	/**
	 * ref to defaultRecordsPerPage
	 * 
	 * @return the defaultRecordsPerPage
	 */
	public String getDefaultRecordsPerPage()
	{
		return defaultRecordsPerPage;
	}

	/**
	 * ref to defaultPagesDisplay
	 * 
	 * @return the defaultPagesDisplay
	 */
	public String getDefaultPagesDisplay()
	{
		return defaultPagesDisplay;
	}

	/**
	 * ref to searchResultExportInd
	 * 
	 * @return the searchResultExportInd
	 */
	public String getSearchResultExportInd()
	{
		return searchResultExportInd;
	}

	/**
	 * ref to fileUploadTempFolderPath
	 * 
	 * @return the fileUploadTempFolderPath
	 */
	public String getFileUploadTempFolderPath()
	{
		return fileUploadTempFolderPath;
	}

	/**
	 * ref to MaxFileSize
	 * 
	 * @return the maximumFileSize
	 */
	public String getMaximumFileSize()
	{
		return maximumFileSize;
	}

	/**
	 * ref to enableLayoutResize
	 * 
	 * @return the enableLayoutResize
	 */
	public boolean getEnableLayoutResize()
	{
		return enableLayoutResize;
	}

	/**
	 * ref to enableAppDrag
	 * 
	 * @return the enableAppDrag
	 */
	public boolean getEnableAppDrag()
	{
		return enableAppDrag;
	}

	/**
	 * ref to responsiveGridInd
	 * 
	 * @return the responsiveGridInd
	 */
	public boolean getResponsiveGridInd()
	{
		return responsiveGridInd;
	}

	/**
	 * ref to responsiveWidth
	 * 
	 * @return the responsiveWidth
	 */
	public String getResponsiveWidth()
	{
		return responsiveWidth;
	}

	/**
	 * ref to dateColumnAlignent
	 * 
	 * @return the dateColumnAlignent
	 */
	public String getDateColumnAlignent()
	{
		return dateColumnAlignent;
	}

	/**
	 * ref to AmtColumnAlignent
	 * 
	 * @return the amountColumnAlignent
	 */
	public String getAmountColumnAlignent()
	{
		return amountColumnAlignent;
	}

	/**
	 * ref to dateTimeColumnAlignent
	 * 
	 * @return the dateTimeColumnAlignent
	 */
	public String getDateTimeColumnAlignent()
	{
		return dateTimeColumnAlignent;
	}

	/**
	 * ref to dateTimeColumnAlignent
	 * 
	 * @return the dateTimeColumnAlignent
	 */
	public String getUserImageUploadPath()
	{
		return userImageUploadPath;
	}

	/**
	 * ref to UserImgsize
	 * 
	 * @return the userImageSize
	 */
	public String getUserImageSize()
	{
		return userImageSize;
	}

	/**
	 * ref to userImageSupportedFormats
	 * 
	 * @return the userImageSupportedFormats
	 */
	public String getUserImageSupportedFormats()
	{
		return userImageSupportedFormats;
	}

	/**
	 * ref to googleMapUri
	 * 
	 * @return the googleMapUri
	 */
	public String getGoogleMapUri()
	{
		return googleMapUri;
	}

	/**
	 * ref to googleMapZoom
	 * 
	 * @return the googleMapZoom
	 */
	public String getGoogleMapZoom()
	{
		return googleMapZoom;
	}

	/**
	 * ref to lsitViewPageSize
	 * 
	 * @return the lsitViewPageSize
	 */
	public String getListViewPageSize()
	{
		return listViewPageSize;
	}

	/**
	 * This method is used to get the default min height of the widget
	 * 
	 * @return default min height
	 */
	public int getMinWgtHeight()
	{
		return minWgtHeight;
	}

	/**
	 * This method is used to get the default max height of the widget
	 * 
	 * @return default max height
	 */
	public int getMaxWgtHeight()
	{
		return maxWgtHeight;
	}

	/**
	 * This method is used to get the context message enable indicator
	 * 
	 */
	public boolean getContextMsgEnable()
	{
		return contextMsgEnable;
	}

	/**
	 * /** This method is used to get the default Page size for Mobility
	 * 
	 */

	public int getDefaultPageSizeForMobile()
	{
		return defaultPageSizeForMobile;
	}

	public boolean getLaunchLookupWithOneRecord()
	{
		return launchLookUpWithOneRecord;
	}

	/**
	 * This method is used to get the configuration, whether to show default symbol for negative amount
	 * 
	 */
	public boolean getNegativeSignInAmountColumn()
	{
		return negativeSignInAmountColumn;
	}

	/**
	 * Returns the configured CT Templates Relative URL
	 * 
	 * @return
	 */
	public String getCTTemplatesRelativeURL()
	{
		return ctTemplatesRelativeURL;
	}

	/**
	 * The following method loads the configuration file.
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 */
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{

		super.loadConfiguration(configSource, defaultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the component preference configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();
		fileUploadTempFolderPath = getWorkCentralizedFolderPath()
				+ ResourceBundleUtils.getString(bundle, "UPLOAD_TEMP_FOLDER", "/FileUpload");
		maximumFileSize = ResourceBundleUtils.getString(bundle, "MAX_FILE_SIZE_MB", "10");
		enableLayoutResize = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "ENABLE_LAYOUT_RESIZE",
				"Y"));
		enableAppDrag = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "ENABLE_APP_DRAG", "Y"));
		responsiveGridInd = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "RESPONSIVE_GRID_IND",
				"Y"));
		contextMsgEnable = StringUtils.convertToBoolean(ResourceBundleUtils
				.getString(bundle, "CONTEXT_MSG_ENABLE", "N"));
		launchLookUpWithOneRecord = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"LAUNCH_LOOKUP_WITH_ONE_RECORD", "N"));
		negativeSignInAmountColumn = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle,
				"NEGATIVE_SIGN_IN_AMOUNT_COLUMN", "Y"));

		responsiveWidth = ResourceBundleUtils.getString(bundle, "INIT_RESPONSIVE_GRID_WIDTH", "350");
		dateColumnAlignent = ResourceBundleUtils.getString(bundle, "DATE_COLUMN_ALIGNMENT", "LEFT");
		amountColumnAlignent = ResourceBundleUtils.getString(bundle, "AMOUNT_COLUMN_ALIGNMENT", "LEFT");
		dateTimeColumnAlignent = ResourceBundleUtils.getString(bundle, "DATE_TIME_COLUMN_ALIGNMENT", "LEFT");
		userImageUploadPath = getWorkCentralizedFolderPath()
				+ ResourceBundleUtils.getString(bundle, "USER_IMAGES_FOLDER", "/PictureUpload");
		userImageSize = ResourceBundleUtils.getString(bundle, "USER_IMAGES_MAXSIZE", "10485760");
		userImageSupportedFormats = ResourceBundleUtils.getString(bundle, "USER_IMAGE_FORMATS", "10485760");
		googleMapUri = ResourceBundleUtils.getString(bundle, "GOOGLE_MAP_URI", "https://www.google.com/jsapi");
		googleMapZoom = ResourceBundleUtils.getString(bundle, "GOOGLE_MAP_ZOOM", "10");
		listViewPageSize = ResourceBundleUtils.getString(bundle, "LIST_VIEW_PAGESIZE", "45");
		searchResultExportInd = ResourceBundleUtils.getString(bundle, "SEARCH_RESULT_EXPORT_REQD", "N");
		defaultRecordsPerPage = ResourceBundleUtils.getString(bundle, "DEFAULT_RECORDS_PER_PAGE", "10");
		defaultPagesDisplay = ResourceBundleUtils.getString(bundle, "DEFAULT_PAGES_DISPLAY", "5");
		actionBtnOrder = ResourceBundleUtils.getString(bundle, "ACTION_BTN_ORDER", "PN");
		minWgtHeight = Integer.parseInt(ResourceBundleUtils.getString(bundle, "WIDGETDEFAULTMINHEIGHT", "150"));
		maxWgtHeight = Integer.parseInt(ResourceBundleUtils.getString(bundle, "WIDGETDEFAULTMAXHEIGHT", "450"));
		defaultPageSizeForMobile = Integer.parseInt(ResourceBundleUtils.getString(bundle,
				"DEFAULT_PAGE_SIZE_FOR_MOBILE", "5"));
		contextMsgEnable = StringUtils.convertToBoolean(ResourceBundleUtils
				.getString(bundle, "CONTEXT_MSG_ENABLE", "N"));
		copyRightMsg = StringUtils.htmlEncode(
				ResourceBundleUtils.getString(bundle, "COPYRIGHT_MSG", "Copyright &copy; CT MODELHOUSE 2014"), null);
		ctTemplatesRelativeURL = ResourceBundleUtils.getString(bundle, "CT_TEMPLATES_FOLDER_PATH", "CTRIAFramework/UITemplates/jqtbs/");

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
		LOGGER.ctdebug("CTCOM00004");
		timer.startTimer(getClass(), "isValidateConfiguration");
		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();

		errorBuilder.append(validator.validateIndicators("ENABLE_LAYOUT_RESIZE", bundle));
		errorBuilder.append(validator.validateIndicators("ENABLE_APP_DRAG", bundle));
		errorBuilder.append(validator.validateIndicators("RESPONSIVE_GRID_IND", bundle));

		errorBuilder.append(validator.validateAlignment("DATE_COLUMN_ALIGNMENT", bundle));
		errorBuilder.append(validator.validateAlignment("AMOUNT_COLUMN_ALIGNMENT", bundle));
		errorBuilder.append(validator.validateAlignment("DATE_TIME_COLUMN_ALIGNMENT", bundle));

		errorBuilder.append(validator.validateImageFormats("USER_IMAGE_FORMATS", bundle));

		errorBuilder.append(validator.validateURI("GOOGLE_MAP_URI", bundle));
		errorBuilder.append(validator.validatePathConfig("UPLOAD_TEMP_FOLDER", bundle, getWorkCentralizedFolderPath()));
		errorBuilder.append(validator.validatePathConfig("USER_IMAGES_FOLDER", bundle, getWorkCentralizedFolderPath()));

		errorBuilder.append(validator.validateNumbers("MAX_FILE_SIZE_MB", bundle));
		errorBuilder.append(validator.validateNumbers("INIT_RESPONSIVE_GRID_WIDTH", bundle));
		errorBuilder.append(validator.validateNumbers("USER_IMAGES_MAXSIZE", bundle));
		errorBuilder.append(validator.validateNumbers("LIST_VIEW_PAGESIZE", bundle));
		errorBuilder.append(validator.validateNumbers("GOOGLE_MAP_ZOOM", bundle));
		errorBuilder.append(validator.validateConfig("COPYRIGHT_MSG", bundle));
		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00005");
		else
		{
			LOGGER.cterror("CTCOM00006", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}
}

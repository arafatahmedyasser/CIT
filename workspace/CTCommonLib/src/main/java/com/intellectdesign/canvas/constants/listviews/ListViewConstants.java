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

package com.intellectdesign.canvas.constants.listviews;

/**
 * This class contains the List View Constants
 * @version 1.0
 */
public interface ListViewConstants
{
	/** Is used to hold list of records got as result of query */

	public static final String NOTIFICATION_COUNT = "NOTIFICATION_COUNT";
	public static final String MESSAGE_COUNT = "MESSAGE_COUNT";

	public static final String REFNOS = "REFNOS";
	public static final String ALL_RECORDS = "ALL_RECORDS";
	public static final String HOST_ACC_ID = "HOST_ACC_ID";
	public static final String BIC_CODE = "BIC_CODE";
	public static final String TOTAL_COUNT = "TOTAL_COUNT";
	public static final String PAGINATION_MODEL = "PAGINATION_MODEL";
	public static final String SORT_MODEL = "SORT_MODEL";
	public static final String VIEW_ID = "VIEW_ID";
	public static final String TXN_DTLS = "TXN_DTLS";
	public static final String RESET_DEFAULT = "RESET_DEFAULT";
	public static final String SMRY_LIST_PRINT_VIEW_HEADER = "SMRY_LIST_PRINT_VIEW_HEADER";
	/** Is used to hold total no of records got as result of query, Ex:15 */
	public static final String INPUT_GCIF = "INPUT_GCIF";
	public static final String INIT_ACTION = "INIT_ACTION";
	public static final String PREF_ACTION = "PREF_ACTION";
	public static final String SAVE_ACTION = "SAVE_ACTION";
	public static final String ACCOUNT_LIST_VIEW = "ACCOUNT_LIST_VIEW";

	public static final String SMRY_LIST_VIEW_HEADER = "SMRY_LIST_VIEW_HEADER";

	public static final String STRUCUTRE_LIST_VIEW = "STRUCUTRE_LIST_VIEW";
	public static final String INPUT_ACTION = "INPUT_ACTION";
	public static final String UPDATE_REFRESH_ACTION = "UPDATE_REFRESH_ACTION";

	public static final String TOTAL_RECORDS = "TOTAL_RECORDS";
	public static final String PAGE_CODE_TYPE = "PAGE_CODE_TYPE";
	public static final String SUMMARY = "SUMMARY"; // Extension for summary widget list view

	public static final String FILTER = "FILTER";// SQL map Key to retriev the filtered Structurrs List

	public static final String FILTER1_FIELD = "FILTER1_FIELD";//
	public static final String FILTER1_CONSTRAINT = "FILTER1_CONSTRAINT";
	public static final String FILTER1_VALUE_TXT = "FILTER1_VALUE_TXT";
	public static final String FILTER2_CONSTRAINT = "FILTER2_CONSTRAINT";
	public static final String FILTER2_FIELD = "FILTER2_FIELD";
	public static final String FILTER2_VALUE_TXT = "FILTER2_VALUE_TXT";
	public static final String FILTER3_CONSTRAINT = "FILTER3_CONSTRAINT";
	public static final String FILTER3_FIELD = "FILTER3_FIELD";
	public static final String FILTER3_VALUE_TXT = "FILTER3_VALUE_TXT";
	public static final String FILTER4_FIELD = "FILTER4_FIELD";
	public static final String FILTER4_CONSTRAINT = "FILTER4_CONSTRAINT";
	public static final String FILTER4_VALUE_TXT = "FILTER4_VALUE_TXT";
	public static final String FILTER5_FIELD = "FILTER5_FIELD";
	public static final String FILTER5_CONSTRAINT = "FILTER5_CONSTRAINT";
	public static final String FILTER5_VALUE_TXT = "FILTER5_VALUE_TXT";
	public static final String FILTER1_VALUE_DATE = "FILTER1_VALUE_DATE";
	public static final String FILTER2_VALUE_DATE = "FILTER2_VALUE_DATE";
	public static final String FILTER1_VALUE_DATE2 = "FILTER1_VALUE_DATE2";
	public static final String FILTER2_VALUE_DATE2 = "FILTER2_VALUE_DATE2";
	public static final String IS_FILTER_FORM = "IS_FILTER_FORM";
	public static final String FILTER1_FIELDTYPE = "FILTER1_FIELDTYPE";
	public static final String FILTER2_FIELDTYPE = "FILTER2_FIELDTYPE";

	public static final String LESS_THAN_EQUAL_TO = "ltEq";// For putting compare value '<='in iBatis sql Query
	public static final String LESS_THAN = "lt";// For putting compare value '<'in iBatis sql Query

	public static final String LESS_THAN_EQUAL_TO_CONST = "<=";
	public static final String LESS_THAN_CONST = "<";
	public static final String AMT_CONST = "_AMT";
	public static final String DT_CONST = "_DT";

	public static final String DATE_TYPE = "DT";
	public static final String TXT_TYPE = "TXT";
	public static final String AMT_TYPE = "AMT";

	public static final String TO = "to";
	public static final String FROM = "from";
	public static final String BETWEEN = "between";
	public static final String ROWNUM_CONSTRAINT = "strBetween";
	public static final String ROWNUM = "RNO";

	public static final String SELECT = "Select";
	public static final String JSON_MAP = "JSON_MAP";
	// Key to get all the selected recods in the list view displayed
	public static final String SELECTED_RECORDS = "SELECTED_RECORDS";
	public static final String SELECTED_RECORDS_LIST = "SELECTED_RECORDS_LIST";
	public static final String INPUT_LANGUAGE_ID = "INPUT_LANGUAGE_ID";
	public static final String PRODUCT_CODE = "PRODUCT_CODE";
	public static final String INPUT_USER_NO = "INPUT_USER_NO";
	public static final String PRODUCT_NAME = "PRODUCT_NAME";
	public static final String INPUT_SUB_PRODUCT = "INPUT_SUB_PRODUCT";
	public static final String INPUT_FUNCTION_CODE = "INPUT_FUNCTION_CODE";
	public static final String CNTY = "CNTY";
	public static final String ACCT_NBR = "ACCT_NBR";
	public static final String HST_ACCT_ID = "HST_ACCT_ID";
	public static final String BANK_ID = "BANK_ID";
	public static final String BRANCH_ID = "BRANCH_ID";
	public static final String ACCT_BR_BIC = "ACCT_BR_BIC";
	public static final String BALANCE_REFRESH = "BALANCE_REFRESH";
	public static final String REPORT_DETAIL_ACTION = "REPORT_DETAIL_ACTION";
	public static final String REPORT_SEQUENCE = "REPORT_SEQUENCE";
	public static final String REPORT_DOWNLOAD_DETAIL = "REPORT_DOWNLOAD_DETAIL";
	public static final String REPORT_NAME = "REPORT_NAME";
	public static final String REPORT_FILE = "REPORT_FILE";
	public static final String ACCT_LIST_VIEW = "ACCT_LIST_VIEW";
	public static final String STR_LIST_VIEW = "STR_LIST_VIEW";
	public static final String INVST_LIST_VIEW = "INVST_LIST_VIEW";
	public static final String ICL_LIST_VIEW = "ICL_LIST_VIEW";
	public static final String ICLA_LIST_VIEW = "ICLA_LIST_VIEW";
	public final static String USER_PREFEERENCE_DATE_FORMAT = "USER_PREFEERENCE_DATE_FORMAT";
	public final static String USER_PREFEERENCE_AMT_FORMAT = "USER_PREFEERENCE_AMT_FORMAT";
	public static final String USER_PREFEERENCE_TIMEZONE_FORMAT = "TIMEZONE";
	public static final String EXPORT_ACTION = "EXPORT_ACTION";
	public static final String VIEW_DATA = "VIEW_DATA";
	public static final String VIEW_DEFINITION = "VIEW_DEFINITION";
	public static final String CONTEXT = "CONTEXT";
	public static final String REFRESH_DATA = "REFRESH_DATA";
	public static final String INVEST_DRILL_INDICATOR = "INVEST_DRILL_INDICATOR";
	public static final String INVEST_DRILL_MAP = "INVEST_DRILL_MAP";
	public final static String STR_AND_GROUP_ID = "STR_AND_GROUP_ID";

	public static final String REPORT_ONDEMAND = "REPORT_ONDEMAND";
	public static final String PORTAL_REPORT_ID = "PORTAL_REPORT_ID";
	public static final String PORTAL_REPORT_HDRACCT = "PORTAL_REPORT_HDRACCT";
	public static final String PORTAL_REPORT_PARTACCT = "PORTAL_REPORT_PARTACCT";
	public static final String PORTAL_REPORT_FROM_DATE = "PORTAL_REPORT_FROM_DATE";
	public static final String PORTAL_REPORT_TO_DATE = "PORTAL_REPORT_TO_DATE";
	public static final String PORTAL_REPORT_LOAN_CCY = "PORTAL_REPORT_LOAN_CCY";
	public static final String REPORT_ONDEMAND_AGG_CODE = "REPORT_ONDEMAND_AGG_CODE";
	public static final String REPORT_ONDEMAND_LOAN_ID = "REPORT_ONDEMAND_LOAN_ID";
	public static final String SORTING_MODEL = "SORTING_MODEL";
	public static final String PRINT_ACTION = "PRINT_ACTION";
	// Added for Sorting model to pass sort order from individual handler
	public static final String SORT_DIR = "dir";

	public static final String RANGE = "range";
	public static final String DT_EQUALS = "dtEquals";
	// Entry to be used to add to set filter while saving preferences
	public static final String GT_EQUALS = "gtEqualTo";
	public static final String LT_EQUALS = "ltEqualTo";
	// Added to pass sort order (Asc or desc) to Report_advices store procedure
	public static final String SORT_DIRECTION_ASCENDING_FOR_RPT_SP = "A";
	public static final String SORT_DIRECTION_DESCENDING_FOR_RPT_SP = "D";
	public static final String UNREAD_COUNT = "UNREAD_COUNT";
	public static final String BIGDECIMAL_DIVISION_QUOTIENT_SCALE = "BIGDECIMAL_DIVISION_QUOTIENT_SCALE";

	public static final String INVESTMENT_TYPE_DISPVAL = "INVESTMENT_TYPE_DISPVAL";
	public static final String LBL_TIMEDE = "Time Deposit";
	public static final String LBL_UTD = "Unitized Time Deposit";
	public static final String TENURE = "TENURE";
	public static final String NOTICE_PERIOD_NUM = "NOTICE_PERIOD_NUM";
	public static final String NOT_APPLICABLE = "NA";
	public static final String DEFAULT_CURR = "DEFAULT_CURR";

	public static final String CURRENCY_LIST = "CURRENCY_LIST";
	public static final String DEFAULT_RATE_CARD = "DEFAULT_RATE_CARD";
	public static final String GCIF = "GCIF";
	public static final String RATE_CARD = "RATE_CARD";
	public static final String RATE_CARD_TYPE = "RATE_CARD_TYPE";
	public static final String CUSTOMER_RATE_CARD = "C";
	public static final String BANK_RATE_CARD = "B";
	public static final String TARGET_CUR = "TARGET_CUR";
	public static final String ADDITIONAL_DATA = "ADDITIONAL_DATA";// To pass additional data along with the records
	// and total count in response. response
	public static final String ONDEMAND_REP_STATUS = "STATUS";
	public static final String SUCCESSFUL = "SUCCESSFUL";
	public static final String FAILURE = "F";
	public static final String ERROR_CODE = "ERROR_CODE";
	public static final String ERROR_MSG = "ERROR_MSG";
	public static final String ONDEMAND_ERROR = "ONDEMAND_ERROR";
	public static final String VIEW_HISTORY_DATA = "VIEW_HISTORY_DATA";
	public static final String ACTION_BY_MAKER = "MAKER";
	public static final String ACTION_BY_AUTHORIZER = "AUTHORIZER";
	public static final String ACTION_BY_BANK = "Bank";
	public static final String ACTION_BY_USER_NM_KEY = "ACTION_BY_USER_NM";
	public static final String VIEWHISTORY_DETAILS = "VIEWHISTORY_DETAILS";
	public static final String ACTION_DATE = "ACTION_DATE";
	public static final String TIME_ZONE_FORMAT = "dd-MM-yy  HH:mm:ss";
	public static final String ACTION_BY = "ACTION_BY";

	public static final String FLD_CURRENCY_CD = "CURRENCY_CD";
	public static final String FLD_USER_PREFERED_CURRENCY_CD = "EQUICURR";
	public static final String FLD_USER_PREFERED_RATECARD = "RATECARD";
	public static final String FLD_EQUIV_AMT = "EQUIV_AMT";
	public static final String FLD_CURR_AVAIL_BAL_AMT = "CURR_AVAIL_BAL_AMT";

	public static final String CROSS_ENTITY_BUCKET_DATE_FIELD = "MAT_DT";
	public static final String CROSS_ENTITY_AMOUNT_FIELD = "INVST_AMT";

	public static final String CACHEKEY_SUFFIX = "_CACHEKEY";

	public static final String DISCLAIMER_REQD_FLAG = "DISCLAIMER_REQD_FLAG";
	public static final String DAM_KEY_INVST_ENTITLEMENT_INFO = "INVST_ENTITLEMENT_INFO";
	public static final String DAM_KEY_AGRMNT_ENTITLEMENT_INFO = "AGRMNT_ENTITLEMENT_INFO";
	public static final String DAM_KEY_ACCT_ENTITLEMENT_ACTION_INFO = "ACCT_ENTITLEMENT_ACTION_INFO";
	public static final String DAM_KEY_ACCOUNT_ENTITLEMENT_ACTION_INFO = "ACCOUNT_ENTITLEMENT_ACTION_INFO";
	public static final String PARAM_OD_GCIF = "OD_GCIF";
	public static final String PARAM_OD_USER_NO = "OD_USER_NO";
	public static final String KEY_INVST_PROD = "INVST_PROD";
	public static final String KEY_OD_FUNCTION_CODE = "OD_FUNCTION_CODE";

	public static final String KEY_INVST_FUND_AC_NO = "FUND_AC_NO";
	public static final String KEY_INVST_FUND_BRANCH_ID = "FUND_BRANCH_ID";
	public static final String KEY_INVST_PRIN_AC_NO = "PRIN_AC_NO";
	public static final String KEY_INVST_PRIN_BRANCH_ID = "PRIN_BRANCH_ID";
	public static final String KEY_INVST_INT_AC_NO = "INT_AC_NO";
	public static final String KEY_INVST_INT_BRANCH_ID = "INT_BRANCH_ID";
	public static final String KEY_ENTITLED_ACTIONS_LIST = "ENTL_ACTIONS_LIST";

	public static final String PLACEHOLDER_VAL_NO_DATA = "--";
	public static final String SYSTEM_DATE_FORMAT = "dd/MM/yyyy";
	public static final int DEFAULT_RATE_FORMAT_PRECISION = 5;
	public static final int DEFAULT_AMOUNT_FORMAT_PRECISION = 2;

	public static final int DEFAULT_AMOUNT_FORMAT_FRACTION_MIN_PRECISION = 2;
	public static final int DEFAULT_AMOUNT_FORMAT_FRACTION_MAX_PRECISION = 5;
	public static final int DEFAULT_AMOUNT_FORMAT_INTEGER = 28;

	public static final String CONTAINS = "contains";
	public static final String STREQUALS = "strEquals";
	public static final String START_COUNT = "START_COUNT";
	public static final String END_COUNT = "END_COUNT";
	public static final int DEFAULT_STARTCOUNT = 1;
	public static final int DEFAULT_ENDCOUNT = 10;
	public static final int DEFAULT_DISPLAYCOUNT = 10;
	public static final String MODE = "MODE";
	public static final String KEY_AGREEMENT_ID = "AGREEMENT_ID";
	public static final String KEY_HEADER_ACCOUNT = "HEADER_ACCOUNT";
	public static final String DAM_KEY_AGRMNT_ACCT_DTLS = "AGRMNT_ACCT_DTLS";
	public static final String DAM_KEY_AGRMNT_FUNCTION_DTLS = "AGRMNT_FUNCTION_DTLS";
	public static final String DAM_KEY_AGRMNT_ACCOUNT_DTLS = "AGRMNT_ACCOUNT_DTLS";

	public static final String INVESTMENT_STATUS_CLOSED = "C";
	public static final String INVESTMENT_STATUS_ACTIVE = "A";
	public static final String INCLUSIVE = "INCLUSIVE";
	public static final String EXCLUSIVE = "EXCLUSIVE";
	public static final String INVST_PROD = "INVST_PROD";

	public static final String NBR_STRCID = "STRCID";
	public static final String NBR_STRGRPID = "STRGRPID";
	public static final String PLANG_ID = "PLANG_ID";
	public static final String P_COUNT = "P_COUNT";
	public static final String FORMAT = "FORMAT";
	public static final String ENTITLED_ACCOUNT_NO = "ENTITLED_ACCOUNT_NO";
	public static final String INPUT_PRODUCT = "INPUT_PRODUCT";
	public static final String BENE_VIEW = "BENE_VIEW";
	public static final String GET_DETAILS = "GET_DETAILS";
	public static final String DRILLED_WIDGET_ID = "DRILLED_WIDGET_ID";
	public static final String DRILL_DOWN_KEY = "DRILL_DOWN_KEY";

	public static final String GET_NO_OF_TXN_AMOUNT = "GET_NO_OF_TXN_AMOUNT";
	public static final String REF_NO_LIST = "REF_NO_LIST";
	public static final String GET_MAX_AUTH_AMOUNT = "GET_MAX_AUTH_AMOUNT";
	public static final String GET_NO_OF_TXN_CURRENT_AMOUNT = "GET_NO_OF_TXN_CURRENT_AMOUNT";

	public static final String ACT_SUM_PRODUCT_CODE = "ACT_SUM_PRODUCT_CODE";
	public static final String TXN_REF_NUM = "TXN_REF_NUM";
	public static final String PROD_DESC = "PROD_DESC";
	public static final String SUB_PROD_DESC = "SUB_PROD_DESC";
	public static final String SUCCESS = "SUCCESS";
	public static final String STATUS = "STATUS";
	public static final String ASC = "ASC";

	public static final String FILE_NAME = "FILE_NAME";
	public static final String ENTL_FUNCTION_CHECK_BATCH = "ENTL_FUNCTION_CHECK_BATCH";
	public static final String CNR_ACTYDATA = "CNR_ACTYDATA";

	public static final String CNR_ACTYDATA_VERIFY = "CNR_ACTYDATA_VERIFY";
	public static final String CNR_ACTYDATA_AUTHORIZE = "CNR_ACTYDATA_AUTHORIZE";
	public static final String CNR_ACTYREJECTDATA = "CNR_ACTYREJECTDATA";

	public static final String RO = "Rejected by Signatory";
	public static final String RV = "Ready for Verification";
	public static final String RA = "Ready for Authorization";
	public static final String PENDING = "PENDING";
	public static final String COMPLETED = "Completed";
	public static final String PROCESSED = "Processed";
	public static final String ERROR = "ERROR";
	public static final String REJECTED = "Error";
	public static final String RE = "Rejected";
	public static final String VERIFIED = "Verified";

	public static final String DEBTOR_ACTYREJECTDATA = "DEBTOR_ACTYREJECTDATA";
	public static final String DEBTOR_ACTYDATA = "DEBTOR_ACTYDATA";

	public static final String INPUT_CHANNEL_ID = "INPUT_CHANNEL_ID";
	public static final String SUB_PRODUCT_LIST = "SUB_PRODUCT_LIST";
	public static final String PRODUCT_LIST = "PRODUCT_LIST";
	public static final String FUNCTION_LIST = "FUNCTION_LIST";
	public static final String ACC = "ACC";
	public static final String CRITERIA_VALUE = "CRITERIA_VALUE";
	public static final String CRITERIA_TYPE = "CRITERIA_TYPE";

	public static final String WIDGET_ID = "WIDGET_ID";

	public static final String line = "line";
	public static final String label = "label";
	public static final String DEFAULT_TOOLTEXT = "xLabel : xValue {br} yLabel : yValue";
	public static final String xLabel = "xLabel";
	public static final String xValue = "xValue";
	public static final String yLabel = "yLabel";
	public static final String yValue = "yValue";
	public static final String displayValue = "displayValue";
	public static final String value = "value";
	public static final String link = "link";
	public static final String tooltext = "tooltext";
	public static final String color = "color";
	public static final String parentyaxis = "parentyaxis";
	public static final String seriesname = "seriesname";
	public static final String showvalues = "showvalues";
	public static final String data = "data";
	public static final String animation = "animation";
	public static final String xAxisName = "xAxisName";
	public static final String yAxisName = "yAxisName";
	public static final String pyAxisName = "pyAxisName";
	public static final String syAxisName = "syAxisName";
	public static final String divlineisdashed = "divlineisdashed";
	public static final String connectnulldata = "connectnulldata";
	public static final String enableSmartLabels = "enableSmartLabels";
	public static final String showLimits = "showLimits";
	public static final String shownames = "shownames";
	public static final String showlegend = "showlegend";
	public static final String showlabels = "showlabels";
	public static final String rotateNames = "rotateNames";
	public static final String logoURL = "logoURL";
	public static final String logoAlpha = "logoAlpha";
	public static final String logoScale = "logoScale";
	public static final String logoPosition = "logoPosition";
	public static final String showBorder = "showBorder";
	public static final String borderalpha = "borderalpha";
	public static final String seriesNameInToolTip = "seriesNameInToolTip";
	public static final String bgcolor = "bgcolor";
	public static final String useEllipsesWhenOverflow = "useEllipsesWhenOverflow";
	public static final String labeldisplay = "labeldisplay";
	public static final String showpercentintooltip = "showpercentintooltip";
	public static final String slantlabels = "slantlabels";
	public static final String useRoundEdges = "useRoundEdges";
	public static final String canvasBorderAlpha = "canvasBorderAlpha";
	public static final String placeValuesInside = "placeValuesInside";
	public static final String forceYAxisValueDecimals = "forceYAxisValueDecimals";
	public static final String yAxisValueDecimals = "yAxisValueDecimals";
	public static final String legendposition = "legendposition";
	public static final String manageresize = "manageresize";
	public static final String decimalprecision = "decimalprecision";
	public static final String pyramidyscale = "pyramidyscale";
	public static final String streamlinedData = "streamlinedData";
	public static final String decimals = "decimals";
	public static final String usesameslantangle = "usesameslantangle";
	public static final String ishollow = "ishollow";
	public static final String formatnumberscale = "formatnumberscale";
	public static final String chartbottommargin = "chartbottommargin";
	public static final String captionpadding = "captionpadding";
	public static final String majortmnumber = "majortmnumber";
	public static final String majortmheight = "majortmheight";
	public static final String minortmnumber = "minortmnumber";
	public static final String minortmheight = "minortmheight";
	public static final String majortmthickness = "majortmthickness";
	public static final String ledgap = "ledgap";
	public static final String ledsize = "ledsize";
	public static final String ledborderthickness = "ledborderthickness";
	public static final String chart = "chart";
	public static final String target = "target";
	public static final String name = "name";
	public static final String type = "type";
	public static final String size = "size";
	public static final String toobject = "toobject";
	public static final String styles = "styles";
	public static final String definition = "definition";
	public static final String application = "application";
	public static final String trendlines = "trendlines";
	public static final String pointer = "pointer";
	public static final String pointers = "pointers";
	public static final String rearextension = "rearextension";
	public static final String basewidth = "basewidth";
	public static final String dial = "dial";
	public static final String dials = "dials";
	public static final String colorrange = "colorrange";
	public static final String WIDGET_JSON = "WIDGET_JSON";
	public static final String category = "category";
	public static final String PIE_JSON = "PIE_JSON";
	public static final String categories = "categories";
	public static final String dataset = "dataset";
	public static final String CHART_JSON = "CHART_JSON";
	public static final String CHART_TYPES = "CHART_TYPES";
	public static final String minValue = "minValue";
	public static final String maxValue = "maxValue";
	public static final String ColorRange = "ColorRange";
	public static final String refLabel = "refLabel";
	public static final String refValue = "refValue";
	public static final String RefPoints = "RefPoints";
	public static final String YLegend = "YLegend";
	public static final String startvalue = "startvalue";
	public static final String dashed = "dashed";
	public static final String valueonright = "valueonright";
	public static final String usemarker = "usemarker";
	public static final String markerradius = "markerradius";
	public static final String code = "code";
	public static final String yAxisMaxValue = "yAxisMaxValue";
	public static final String numDivLines = "numDivLines";
	public static final String yAxisMinValue = "yAxisMinValue";
	public static final String xLabels = "xLabels";
	public static final String yLabels = "yLabels";
	public static final String yData = "yData";
	public static final String xLegend = "xLegend";
	public static final String GRID_JSON = "GRID_JSON";
	public static final String rotatevalues = "rotatevalues";
	public static final String useSameSlantAngle = "useSameSlantAngle";
	public static final String showFCMenuItem = "showFCMenuItem";
	public static final String INPUT_USER_ROLE = "INPUT_USER_ROLE";
	public static final String renderas = "renderas";
	public static final String IS_MULTI_CHART = "IS_MULTI_CHART";
	public static final String paletteColors = "paletteColors";
	public static final String DEFAULT_COLOR_PALETTE = "DEFAULT_COLOR_PALETTE";
	public static final String COLOR_PALETTE = "COLOR_PALETTE";
	public static final String INITIAL_SECONDARY = "INITIAL_SECONDARY";

}

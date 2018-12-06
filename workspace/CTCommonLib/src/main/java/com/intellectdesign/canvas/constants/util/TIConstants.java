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

package com.intellectdesign.canvas.constants.util;

import com.intellectdesign.canvas.constants.common.JSPIOConstants;

/**
 * This class contains the TI Constants
 * 
 * @version 1.0
 */
public class TIConstants
{
	/**
	 * Private cnstructor to avoid instantiation. ref to TIConstants
	 */
	private TIConstants()
	{
	}

	public static final int SESSIONID_INDEX_IN_VECTOR = 0;
	public static final int GCIF_INDEX_IN_VECTOR = 2;
	public static final int USER_NO_INDEX_IN_VECTOR = 3;
	public static final int FUNCTION_CODE_INDEX_IN_VECTOR = 4;
	public static final int PROD_CODE_INDEX_IN_VECTOR = 5;
	public static final int SUBPROD_CODE_INDEX_IN_VECTOR = 6;
	public static final int LANGID_INDEX_IN_VECTOR = 12;
	public static final int INPUT_ACTION_INDEX_IN_VECTOR = 18;
    public static final int REL_CACHEDMAP_INDEX_IN_VECTOR=-1;
    public static final int REL_CACHEDMAP_INDEX_IN_VECTOR_SO=-3;
	public static final int VALUE_DATE_INDEX_IN_VECTOR = 14;
	public static final int VALUE_VECTOR_7 = 7;
	public static final int VALUE_VECTOR_8 = 8;
	public static final int VALUE_VECTOR_9 = 9;
	public static final int VALUE_VECTOR_13 = 13;
	public static final int VALUE_VECTOR_14 = 14;
	public static final int VALUE_VECTOR_15 = 15;
	public static final int VALUE_VECTOR_17 = 17;
	public static final int VALUE_VECTOR_18 = 18;
	public static final int VALUE_VECTOR_19 = 19;
	public static final int VALUE_VECTOR_20 = 20;
	public static final int VALUE_VECTOR_21 = 21;
	public static final int VALUE_VECTOR_22 = 22;
	public static final int VALUE_VECTOR_23 = 23;
	public static final int VALUE_VECTOR_24 = 24;
	public static final int VALUE_VECTOR_25 = 25;
	public static final int VALUE_VECTOR_26 = 26;
	public static final int VALUE_VECTOR_27 = 27;

	public final static String USER_PREFEERENCE_DATE_FORMAT = "USER_PREFEERENCE_DATE_FORMAT";
	public static final String USER_PREFEERENCE_TIMEZONE_FORMAT = "TIMEZONE";

	public static final String USR_DATE_FORMAT = "USR_DATE_FORMAT";
	public static final String DCG_CODE = "codeType";
	// vector names.
	public final static int TXNSTATUS_POS = 15;
	public final static int REFERENCE_NO_POS = 11;
	public final static int CONFIRMSCR_POS = 19;
	public final static int VERSION_NO_POS = 16;
	public final static int TEMPLATE_REF_NO=28; //CHG_005

	public final static String LOGIN_ID = JSPIOConstants.LOGIN_ID;
	public final static String REFERENCE_NO = JSPIOConstants.INPUT_REFERENCE_NO;
	public final static String VER_NO = JSPIOConstants.INPUT_VER_NO;
	public final static String ODTXN_TYPE = "odTxnType";
	public final static String SERVICE_TYPE = "serviceType";
	public final static String GCIF = JSPIOConstants.INPUT_GCIF;
	public final static String TXN_TYPE = "txnType";
	public final static String TXN_STATUS = JSPIOConstants.INPUT_TXN_STATUS;
	public final static String DEBIT_ACC_NO = JSPIOConstants.INPUT_DEBIT_ACC_NO;
	public final static String DEBIT_ACC_NAME = "accntName";
	public final static String DEBIT_CURRENCY = JSPIOConstants.INPUT_DEBIT_CURRENCY;
	public final static String DEBIT_BRANCH = JSPIOConstants.INPUT_DEBIT_BRANCH;
	public final static String DEBIT_AMOUNT = JSPIOConstants.INPUT_DEBIT_AMOUNT;
	public final static String VALUE_DATE = JSPIOConstants.INPUT_VALUE_DATE;
	public final static String __LIBRARY_PROVIDER_CLASS = JSPIOConstants.__LIBRARY_PROVIDER_CLASS;
	public final static String __LIBRARY_LOOKUP_ACTION = JSPIOConstants.__LIBRARY_LOOKUP_ACTION;
	public final static String DEBIT_DESC = "debitDesc";
	public final static String DEBIT_REF = "debitRef";
	public final static String BENE_ACC_NO = "beneAccNo";
	public final static String CONSUMER_ACC_NO = "consumeraccNo";
	public final static String BENE_CURRENCY = "beneCurrency";
	public final static String BENEDETAIL_BANK_NAME = "beneDetailBankName";
	public final static String BENEDETAIL_ACC_NO = "beneDetailAccNo";
	// public final static String PAYMENT_DATE="PAYMENT_DATE";
	public final static String PAYMENT_DATE = "payDate";
	public final static String PAYMENT_AMOUNT = "payAmt";
	public final static String CREDIT_REF = "CREDIT_REF";
	public final static String CREDIT_DESC = "CREDIT_DESC";
	public final static String PAYMENT_DETAILS = "payDetails";
	public final static String BENE_ID = "beneId";
	public final static String BENE_NAME = "beneName";
	public final static String BENE_BANK_NAME = "beneBname";
	public final static String BENE_BRANCH = "beneBranchName";
	public final static String ADDRESS_1 = "Address1";
	public final static String ADDRESS_2 = "Address2";
	public final static String FAX_NO = "faxNo";
	public final static String TAX_ID = "taxId";
	public final static String PHONE_NO = "phoneNo";
	public final static String EMAIL_ID = "emailId";
	public final static String BY_ORDER_OF = "byOrder";
	public final static String AUTH_PERSON = "authPerson";
	public final static String IC_NO = "icNo";
	public final static String DRAWEE_BRANCH = "drawBranch";
	public final static String ACC_TYPE = "ACC_TYPE";
	public final static String BENE_CHARGES = "benCharges";
	public final static String CHG_SHR_CUST = "CHG_SHR_CUST";
	public final static String CHG_SHR_BENE = "CHG_SHR_BENE";
	public final static String PAYING_BRANCH = "payBranch";
	public final static String DELIVERY_METHOD = "_delMethod";
	public final static String COLLEC_BRANCH = "collecBranch";
	public final static String DEL_ADDRESS_1 = "delAddress1";
	public final static String DEL_ADDRESS_2 = "delAddress2";
	public final static String PAYMENT_DETAILS1 = "payDetails1";
	public final static String PAYMENT_DETAILS2 = "payDetails2";
	public final static String PAYMENTS_TYPE = "PAYMENT_TYPE";
	public final static String PAYMENT_TYPE = "payType";
	public final static String PAYMENT_REF = "payRef";
	public final static String FORMP_NO = "formNo";
	public final static String ENRICH_DETAILS = "enrichDetails";
	public final static String PAYMENT_PURPOSE = "payPurpose";
	public final static String INVOICE_TYPE = "invoiceType";
	public final static String BENE_NEW_IC = "BENE_NEW_IC";
	public final static String BENE_OLD_IC = "BENE_OLD_IC";
	public final static String PAYMENT_MODE = "payMode";
	public final static String CLEAR_CODE = "CLEAR_CODE";
	public final static String CUTOFF_DATE = "cutoffDate";
	public final static String HOST_REF_NO = "hostRefNo";
    public final static String INPUT_DEBIT_CURRENCY="INPUT_DEBIT_CURRENCY";
	public final static String DEBIT_VAL_DATE = "debitValDate";
	public final static String PRODUCT = JSPIOConstants.INPUT_PRODUCT;
	public final static String INPUT_PRODUCT = "PRODUCT";
	public final static String SUB_PRODUCT = "INPUT_SUB_PRODUCT";
	public final static String INPUT_SUB_PRODUCT = "SUB_PRODUCT";
	public final static String TXN_REF_NUM = "TXN_REF_NUM";
	public final static String INPUT_HOST_CODE = "INPUT_HOST_CODE";
	public final static String FUNCTION_CODE = JSPIOConstants.INPUT_FUNCTION_CODE;
	public final static String CREATED_DATE = "createdDate";
	public final static String MODIFIED_DATE = "modifiedDate";

	// public final static String SESSION_ID = JSPIOConstants.INPUT_SESSION_ID;
	public final static String USER_NO = JSPIOConstants.INPUT_USER_NO;
	public final static String CHANNEL_ID = JSPIOConstants.INPUT_CHANNEL_ID;
	public final static String LANGUAGE_ID = JSPIOConstants.INPUT_LANGUAGE_ID;
	public final static String CUST_TYPE = JSPIOConstants.INPUT_CUST_TYPE;
	public final static String ACTION = JSPIOConstants.INPUT_ACTION;
	public final static String INPUT_ACTION = "ACTION";
	public final static String CONFIRMATION = JSPIOConstants.INPUT_CONFIRMATION;
	public final static String DUMMY_1 = JSPIOConstants.INPUT_DUMMY_1;
	public final static String DUMMY_2 = JSPIOConstants.INPUT_DUMMY_2;
	public final static String DUMMY_3 = JSPIOConstants.INPUT_DUMMY_3;
	public final static String DUMMY_4 = JSPIOConstants.INPUT_DUMMY_4;
	public final static String DUMMY_5 = JSPIOConstants.INPUT_DUMMY_5;
	public final static String DUMMY_6 = JSPIOConstants.INPUT_DUMMY_6;

	public final static String TMPLT_NAME = JSPIOConstants.INPUT_TMPLT_NAME;
	public final static String TMPLT_TYPE = JSPIOConstants.INPUT_TMPLT_TYPE;
	public final static String CREDIT_TYPE = "creditType";
	public final static String MULTI_REFERENCE_NO = "mtxnRefNo";
	public final static String ACC_LIST = "accList";
	public final static String ACC_DETAILS = "accDetails";
	public final static String BENE_LIST = "beneList";
	public final static String CCY_LIST = "CurrencyList";
	public final static String CHRS_LIST = "ChargesList";
	public final static String PAY_BRAN_LIST = "payBranList";
	public final static String DEL_METH_LIST = "delMethList";
	public final static String COLL_BRAN_LIST = "collBranList";

	public final static String BENE_VER_NO = "BENE_VER_NO";
	public final static String BENE_ACC_TYPE = "BENE_ACC_TYPE";
	public final static String CRUD_STATUS = JSPIOConstants.INPUT_CRUD_STATUS;
	public final static String BENE_SAVE_TYPE = "BENE_SAVE_TYPE";
	public final static String DEBT_ACC_TYPE = "DEBT_ACC_TYPE";
	public final static String MODE = JSPIOConstants.INPUT_MODE;

	public final static String DETAILS_1 = "DETAILS_1";
	public final static String DETAILS_2 = "DETAILS_2";
	public final static String DETAILS_3 = "DETAILS_3";
	public final static String DETAILS_4 = "DETAILS_4";

	public final static String BENEACC_LIST = "BENEACC_LIST";
	public final static String BENECCY_LIST = "BENECCY_LIST";
	public final static String BENENAME_LIST = "BENENAME_LIST";

	public final static String BANK_LIST = "BANK_LIST";
	public final static String BRANCH_LIST = "BRANCH_LIST";
	public final static String BENE_PRODUCT = "BENE_PRODUCT";
	public final static String BENE_SUBPRODUCT = "BENE_SUBPRODUCT";
	public final static String PRODUCT_LIST = "PRODUCT_LIST";
	public final static String SUBPRODUCT_LIST = "SUBPRODUCT_LIST";
	public final static String PAYPURPOSE_LIST = "PAYPURPOSE_LIST";
	public final static String PAYMODE_LIST = "PAYMODE_LIST";

	public final static String ERROR_CODE = "ERROR_CODE";
	public final static String ERROR_DESC = "ERROR_DESC";
	public final static String VALIDATE_STATUS = "VALIDATE_STATUS";
	public final static String BENE_ERROR = "BENE_ERROR";
	public final static String FROM_REC = "FROMREC";
	public final static String TO_REC = "TOREC";
	public final static String TOTAL_RECORDS = "TOT_REC";
	public final static String EXCHANGE_RATE = "EXCHANGE_RATE";
	public final static String HIGH_LIMIT = "HIGH_LIMIT";
	public final static String PAY_TYPE = "PAY_TYPE";
	public final static String BALANCE_AMOUNT = "BALANCE_AMOUNT";
	public final static String PAYLOAD_DATA = "PAYLOAD_DATA";
	public final static String id4 = "id4";

	public final static String BENE_BANK_ADD_1 = "BENE_BANK_ADD1";
	public final static String BENE_BANK_ADD_2 = "BENE_BANK_ADD2";

	public final static String BATCH_TXN_NO = JSPIOConstants.INPUT_BATCH_TXN_NO;
	public final static String RULE_ID = JSPIOConstants.INPUT_RULE_ID;
	public final static String USER_NAME = JSPIOConstants.INPUT_USER_NAME;

	public final static String BATCH_REF_NO = JSPIOConstants.INPUT_BATCH_REF_NO;
	public final static String BATCH_VER_NO = JSPIOConstants.INPUT_BATCH_VER_NO;

	public final static String BASE_CURR = "BASE_CURR";

	public final static String MOD_BY = "MOD_BY";
	public final static String TOTAL_TRANSACTION_COUNT = "TOTAL_TRANSACTION_COUNT";
	public final static String AUTH_ID = "AUTH_ID";
	public final static String AUTH_DATE = "AUTH_DATE";

	public final static String ADDRESS_3 = "Address3";
	public final static String ADDRESS_4 = "Address4";
	public final static String DEL_ADDRESS_3 = "Delivery_Address3";
	public final static String DEL_ADDRESS_4 = "Delivery_Address4";
	public final static String BENE_CITY = "Bene_City";
	public final static String BENE_COUNTRY = "Bene_Country";
	public final static String BENE_PIN = "Bene_Pin";
	public final static String DELV_CITY = "Delivery_City";
	public final static String DELV_COUNTRY = "Delivery_Country";
	public final static String DELV_PIN = "Delivery_Pin";

	public final static String CHARGES_TO = "Charges To";
	public final static String PAY_PURPOSE = "Payment Purpose";
	public final static String PAY_MODE = "Payment Mode";
	public final static String DEL_METHOD = "Delivery Method";
	public final static String DELBANK = "DELBANK";
	public final static String TRAN_REF_NO = "TRAN_REF_NO";
	public final static String SAL_FLAG = "SAL_FLAG";

	public final static String MAX_ROWS = "200";
	public final static String FROM_REC_NO = "1";
	public final static String TO_REC_NO = "10";

	public final static String SHA = "SHA";
	public final static String OUR = "OUR";
	public final static String BEN = "BEN";
	public final static String DELCUST = "DELCUST";
	public final static String DELBENE = "DELBENE";
	public final static String DELOTCN = "DELOTCN";

	public final static String BANK_VAL = "BANK_VAL";
	public final static String BANK_ADD1 = "BANK_ADD1";
	public final static String BANK_ADD2 = "BANK_ADD2";

	public final static String CHG_CODE = "CHG_CODE";
	public final static String CHG_DESCRIPTION = "CHG_DESCRIPTION";
	public final static String PURP_CODE = "PURP_CODE";
	public final static String PURP_DESCRIPTION = "PURP_DESCRIPTION";
	public final static String DATEVALUE = "DATEVALUE";
	public final static String DELV_CODE = "DELV_CODE";
	public final static String DELV_DESCRIPTION = "DELV_DESCRIPTION";
	public final static String MODE_CODE = "MODE_CODE";
	public final static String MODE_DESCRIPTION = "MODE_DESCRIPTION";

	public final static String PROD_CODE = "prodCode";
	public final static String PROD_DESC = "prodDesc";
	public final static String SUBPROD_CODE = "subProdCode";
	public final static String SUBPROD_DESC = "subProdDesc";

	public final static String TEMPLATE_ID = "TEMPLATE_ID";
	public final static String TEMPLATE_NAME = "TEMPLATE_NAME";
	public final static String ACCOUNT_NUM = "ACCOUNT_NUM";
	public final static String TEMPL_PRIVATE = "TEMPL_PRIVATE";
	public final static String MAKER_ID = "MAKER_ID";
	public final static String TEMPLATE_LIST = "TEMPLATE_LIST";
	public final static String LOAD_TEMPLATE = "LOAD_TEMPLATE";
	public final static String VIEW_TEMP = "VIEW_TEMP";
	public final static String HOSTCODE_ENTP = "ENTP";
	public final static String HOSTCODE_IFTS = "IFTS";
	public final static String HOSTCODE_COTE = "COTE";
	public final static String HOSTCODE_CCQE = "CCQE";
	public final static String HOSTCODE_DFTE = "DFTE";
	public final static String HOSTCODE_GIRS = "GIRS";
	public final static String HOSTCODE_INBE = "INBE";
	public final static String HOSTCODE_OIBE = "OIBE";
	public final static String HOSTCODE_CTTE = "CTTE";
	public final static String HOSTCODE_MCQE = "MCQE";
	public final static String HOSTCODE_CSYE = "CSYE";
	public final static String HOSTCODE_RECR = "STIE";
	public static final String HOSTCODE_WFRS = "WFRS";
	public static final String HOSTCODE_PAWF = "PAWF";
	public static final String HOSTCODE_STIN = "STIN";

	public final static String TEMP_LIST = "TEMP_LIST";
	public final static String HOME = "HOME";
	public final static String PAY_TRAN = "PAY_TRAN";
	public final static String NO_TEMPL_FOUND = "NO_TEMPL_FOUND";
	public final static String PRIVATE = "PRIVATE";
	public final static String PUBLIC = "PUBLIC";

	public final static String BENE_BANKS = "BENE_BANKS";
	public final static String BENE_ACCNOS = "BENE_ACCNOS";
	public final static String BENE_BRANCHS = "BENE_BRANCHS";

	public final static String BENE_ARR_LIST = "BENE_ARR_LIST";

	public final static String CITY_LIST = "CITY_LIST";
	public final static String DRAWEE_BRANCH_LIST = "DRAWEE_BRANCH_LIST";
	public final static String PAY_LOCATION = "PAY_LOCATION";
	public final static String CITY = "CITY";
	public final static String DRA_BRANCH = "DRA_BRANCH";
	public final static String SEARCH_FOR = "SEARCH_FOR";
	public final static String REQUEST_REASON = "REQUEST_REASON";
	public final static String TXN_FUNCTION_CODE = "TXN_FUNCTION_CODE";
	public final static String SERVICE_REF_NO = "SERVICE_REF_NO";
	public final static String REQUEST_BY = "REQUEST_BY";
	public final static String MAKER_DATE = "MAKER_DATE";

	public final static String OD_HOST_TXN_CODE = "OD_HOST_TXN_CODE";
	public final static String OD_BOOK_REF_NO = "OD_BOOK_REF_NO";
	public final static String OD_REQUEST_REASON = "OD_REQUEST_REASON";
	public final static String REINREASON = "REINREASON";
	public final static String DEAL_REF_NO = "DEAL_REF_NO";
	public final static String PAGINATION = "PAGINATION";

	public final static String INST_NUMBER = "INST_NUMBER";
	public final static String INST_VAL_DAT = "INST_VAL_DAT";
	public final static String INST_STATUS = "INST_STATUS";
	public final static String INST_STA_DAT = "INST_STA_DAT";
	public final static String INST_DETAIL = "INST_DETAIL";

	public final static String WORK_FLOW_INFO = "WORK_FLOW_INFO";

	public final static String ERR_CODE_LIST = "error";

	public final static String BROKER_NAME = "BROKER_NAME";
	public final static String RATE_APPLIED = "RATE_APPLIED";

	public final static String CONT_CHAR_LT = "4";
	public final static String DETL_CHAR_LT = "35";

	public final static String HOSTCODE_DELV = "DELV";
	public final static String HOSTCODE_SHIP = "SHIP";

	public final static String PAYMENTDATE = "PAYMENTDATE";

	public final static String CHARGE_TO = "CHARGE_TO";
	public final static String PAYMENT_CYCLE = "PAYMENT_CYCLE";
	public final static String PAYMENT_DT = "PAYMENT_DT";
	public final static String FIRST_PAYMENT_DATE = "FIRST_PAYMENT_DATE";
   public final static String  NEXT_PAYMENT_DATE = "NEXT_PAYMENT_DATE";//CHG_BCA_NPD
	public final static String PAY_EVERY = "PAY_EVERY";
	public final static String PAY_EVERY_SPEC = "PAY_EVERY_SPEC";
	public final static String NO_OF_PAYMENTS = "NO_OF_PAYMENTS";
	public final static String ON = "On";
	public final static String LAST_PAYMENT_DATE = "LAST_PAYMENT_DATE";
	public final static String SYSTEM_CD = "SYSTEM_CODE";
	public final static String SYSTEM_NAME = "SYSTEM_NAME";
	public final static String USE_OVERDRAFT = "PAYMENT_USE_OVERDRAFT";
	public final static String IF_HOLIDAY = "PAYMENT_IF_HOLIDAY";
	public final static String PAYMENT_INVOICE_DEATILS = "PAYMENT_INVOICE_DEATILS";
	public final static String INSERT_MT = "MT";
	public final static String INSERT_HT = "HT";
	public final static String PAYMENT_DAM_KEY = "OO_PAYMENT_TXN_MT";
	public final static String TXN_REF_NO = "INPUT_REFERENCE_NO";
	public final static String TXN_REFERENCE_NO = "TXN_REF_NO";
	public final static String REC_BENE_ID = "BENE_ID";
	public final static String STND_INST_REF_NO = "REF_NO";
	public final static String REC_GCIF = "GCIF";
	public final static String REC_SUB_PROD = "SUB_PROD";
	public final static String REC_BANK_CODE = "BANK_CODE";
	public final static String REC_BRANCH_CODE = "BRANCH_CODE";
	public final static String REC_OD_STATUS = "OD_REF_NO";
	public final static String REC_VER_NO = "VER_NO";

	public final static String REC_COUNTRY_CODE = "COUNTRY_CODE";
	public final static String REC_CITY_CODE = "CITY_CODE";
	public final static String REC_PAY_LOC_CD = "PAY_LOC_CD";
	public final static String PAYMENT_DAM_KEY_BENE_BANK = "STND_INST_BENE_BANK_DETAILS";
	public final static String PAYMENT_DAM_KEY_BRANCH = "STND_INST_BRANCH_DETAILS";
	public final static String PAYMENT_DAM_KEY_OD_STATUS = "STND_INST_OD_STATUS";
	public final static String PAYMENT_DAM_KEY_VIEW_HT = "STND_INST_VIEW_TXN_HT_DETAILS";
	public final static String PAYMENT_DAM_KEY_COUNT_REF_NUM = "STND_INST_COUNT_REF_NUM";
	public final static String PAYMENT_DAM_KEY_CITY_NAME = "STND_INST_CITY_NAME";
	public final static String PAYMENT_DAM_KEY_COUNTRY_NAME = "STND_INST_COUNTRY_NAME";
	public final static String PAYMENT_DAM_KEY_HISTORY = "STAND_INST_TXN_HISTORY";
	public final static String PAYMENT_DAM_KEY_DELETE = "STAND_INST_TXN";
	public final static String BENE_DAM_KEY = "STND_INST_BENE_DETAILS";
	public final static String PAYMENT_DAM_KEY_VIEW = "STND_INST_VIEW_TXN_DETAILS";
	public final static String PAYMENT_DAM_KEY_TEMPLATE = "STND_INST_TEMPLATE";
	public final static String PAYMENT_DAM_KEY_TEMPLATE_VIEW = "STND_INST_TEMPLATE_LIST";
	public final static String BANKNAME_LIST = "BANKNAME_LIST";
	public final static String BeneBankName = "BeneBankNameValue";

	public final static String COMPANY_ID = "CUST_ID";
	public final static String COMPANY_DESC = "CUST_DESC";
	public final static String GROUP_NAME = "grpName";
	public final static String ALL_ACCTS = "ALL_ACCTS";
	public final static String GROUP_DESC = "GROUP_DESC";
	public final static String SELECTED_ACCTS = "SELECTED_ACCTS";
	public final static String SEL_ACCTS = "SEL_ACCTS";
	public final static String UAG_ERROR = "This Group Name Already Exists for this Company";
	public final static String UAG_ID = "uagId";
	public final static String UAG_PRODUCT = "UAG_PRODUCT";
	public final static String UAG_VER_NO = "UAG_VER_NO";
	public final static String GCIF_ID = "GCIF_ID";
	public final static String GCIF_NAME = "GCIF_NAME";
	public final static String BENEGRP_ID = "BENEGRP_ID";
	public final static String BENEGRP_NAME = "BENEGRP_NAME";
	public final static String BENEGRP_DESC = "BENEGRP_DESC";
	public final static String ALL_BENEGRP = "ALL_BENEGRP";
	public final static String SELECTED_BENEGRP = "SELECTED_BENEGRP";
	public final static String SEL_BANE = "SEL_BANE";
	public final static String BENE_GROUP_ID = "beneGroupId";
	public final static String BENE_GRP_NAME = "beneGroupName";
	public final static String BENE_GRP_LIST = "beneGrpList";
	public final static String BENE_NAME_LIST = "beneNameList";
	public final static String SLCT_GCIF_LIST = "selectgcifList";
	public static final int REL_TIMEZONE_INDEX_IN_VECTOR = 27;

	public static final String CUST_AUDIT_DATE_TIME = "CUST_AUDIT_DATE_TIME";
	public static final String CUST_CUSTOMER_ID = "CUST_CUSTOMER_ID";
	public static final String CUST_LOGIN_ID = "CUST_LOGIN_ID";
	public static final String CUST_PRODUCT = "CUST_PRODUCT";
	public static final String CUST_EVENT_ACTION = "CUST_EVENT_ACTION";
	public static final String CUST_REFERENCE_NUMBER = "CUST_REFERENCE_NUMBER";

	public final static String BENE_REQUEST_EXIST = "BENE_REQUEST_EXIST";
	public final static String BENE_TEMPLATE_EXIST = "BENE_TEMPLATE_EXIST";
	public final static String SI_BENE_BRANCH = "SI_BENE_BRANCH";
	public final static String SI_BENE_CITY = "SI_BENE_CITY";
	public final static String SI_BENE_COUNTRY = "SI_BENE_COUNTRY";
	public final static String SI_ADDITIONAL_DETAIL_CODE = "SI_ADDITIONAL_DETAIL_CODE";
	public final static String SI_ADDITIONAL_DETAIL_TYPE = "SI_ADDITIONAL_DETAIL_TYPE";
	public final static String BENE_ADDNL_CODE = "BENE_ADDNL_CODE";
	public final static String BENE_ADDNL_TYPE = "BENE_ADDNL_TYPE";

	public final static String PAYMENT_DAM_KEY_BANK_BRANCH = "STND_INST_BANK_BRANCH_DETAILS";
	public final static String BENE_BANK_CODE = "BENE_BANK_CODE";
	public final static String BENE_BANK_BRANCH_CODE = "BENE_BANK_BRANCH_CODE";
	public final static String SI_CURRENCY = "SI_CURRENCY";
	public final static String SI_AMOUNT = "SI_AMOUNT";
	public final static String PAY_LOCATION_CODE = "PAY_LOCATION_CODE";

	public final static String DUMMY_7 = "INPUT_DUMMY_7";
	public final static String CHARGE_ACCOUNT = "chargeAccount";
	public final static String DEAL_RATE = "DEAL_RATE";
	public static final String BENE_BANK_SWIFT_CODE = "BENE_BANK_SWIFT_CODE";
	public static final String CHQ_STATUS = "CHQ_STATUS";
	public final static String DEAL_FLAG = "DEAL_FLAG";
	public final static String ADDTIONALINFO = "ADDTIONALINFO";

	public final static String LOC_LIST = "LOC_LIST";

	public final static String BANK_NAME = "BANK_NAME";
	public final static String BENE_BNK_BRNH = "BENE_BNK_BRNH";
	public final static String INTERBENE_COUNTRY = "BENE_COUNTRY";
	public final static String ADD_FLD1 = "BANK_NAME";
	public final static String IFSC_CODE_REG="IFSC_CODE_REG";
	public final static String BENE_ACC_TYPE_IND="BENE_ACC_TYPE_DESC";
	public final static String ADD_FLD2 = "BENE_BNK_BRNH";
	public final static String ADD_FLD3 = "BENE_COUNTRY";
	public final static String ADDTIONALINFO3 = "ADDTIONALINFO3";
	public final static String SERVICE_PROVIDER = "SERVICEPROVIDER";
	public final static String LOCATION_LIST = "LOCATION_LIST";

	public final static String ACC_NO_DOWNLOAD = "ACC_NO_DOWNLOAD";
	public final static String ACC_TYPE_DOWNLOAD = "ACC_TYPE_DOWNLOAD";
	public final static String POST_DATE_DOWNLOAD = "POST_DATE_DOWNLOAD";

	public final static String OD_ACC_NO = "OD_ACC_NO";
	// public final static String OD_CARD_ACC_NO = "OD_CARD_ACC_NO";
	public final static String OD_CARD_ACC_NO = "CARD_NO";
	public final static String INPUT_USER_NO = "INPUT_USER_NO";
	public final static String STMT_ACC_NO = "STMT_ACC_NO";
	public final static String STMT_ENQ_MODE = "STMT_ENQ_MODE";
	public final static String APP_ID = "CIB2STMCYC";
	public final static String STMT_ENQ_MODE_ACC_NO = "A";
	public final static String STMT_ENQ_MODE_ACC_NO_CREDIT_NO = "C";

	public final static String ACCNO_KEY = "ACCNO";
	public final static String APP_ID_KEY = "APP_ID_KEY";
	public final static String SH_DESC = "Pay Less";
	public final static String BENE_DESC = "Beneficiary";
	public final static String OUR_DESC = "Pay In Full";
	public final static String SH = "SH";
	public final static String BENE = "BENE";

	public final static String THRESHOLDVAL = "RE_AUTH";

	public final static String HOST_REF = "HOST_REF_NO";
	public final static String OD_HOST_REF_NO = "OD_HOST_REF_NO";
	public final static String CONSUMER_ACC = "CONSUMER_ACC_NO";
	public final static String INPUT_CREDIT_AMOUNT = "INPUT_CREDIT_AMOUNT";
	public final static String CUST_REF = "CUST_REF";
	public final static double AMOUNT_ZERO = 0.00;

	public final static String SI_FIRST_PAY_DATE = "SI_FIRST_PAY_DATE";
	public final static String SI_NO_PAY = "SI_NO_PAY";

	public final static String SI_LAST_PAY_DATE = "SI_LAST_PAY_DATE";
	public final static String EXEC_FREQ = "EXEC_FREQ";
	public final static String BENE_BANK_COUNTRY = "BENE_BANK_COUNTRY";
	public final static String BENE_BANK_BIC = "BENE_BANK_BIC";
	public final static String BENE_BRANCH_CITY = "BENE_BRANCH_CITY";

	public final static String BENE_ACC_NUM = "BENE_ACC_NO";
	public final static String BENE_CURR = "BENE_CURRENCY";
	public final static String BENE_ACC_NAME = "BENE_ACC_NAME";
	public final static String BENE_BANK = "BENE_BANK";
	public final static String BENE_BRNCH = "BENE_BRANCH";
	public final static String INPUT_DEBIT_ACC_TYPE = "INPUT_DEBIT_ACC_TYPE";
	public final static String INPUT_DEBIT_ACC_NAME = "INPUT_DEBIT_ACC_NAME";
	public final static String PAYMENT_MOD = "PAYMENT_MODE";
	public final static String CHARGE_ACC_NUMBER = "CHARGE_ACC_NUMBER";
	public final static String CHRGES_TO = "CHARGES_TO";
	public final static String CHQ = "CHQ";
	public final static String BENE_BNK_BIC = "BENE_BNK_BIC";
	public final static String PAYMENT_GATEWAY = "PAYMENT_GATEWAY";

	public final static String INTERNAL_SUBPORD = "BKSIFT";
	public final static String THIRDPARTY_SUBPORD = "BKSIBT";
	public final static String DOMESTIC_SUBPORD = "BKSRNT";
	public final static String CROSS_BORDER_SUBPORD = "TELTRF";
	public static final String SI_SUBPROD = "RECPAY";

	public final static String INTERNAL_FUNCCODE = "CRIFT";
	public final static String THIRDPARTY_FUNCCODE = "CRIBT";
	public final static String DOMESTIC_FUNCCODE = "CRRNTS";
	public final static String CROSS_BORDER_FUNCCODE = "CRTTT";
	public static final String SI_FUNCCODE = "RECUR";
	public static final String SI_CANCEL_FUNCODE="CNCLSI";
	public static final String SI_AMEND_FUNCODE="AMNDSI";
	
	public final static String POPDMC="POPDMC";
	public final static String FRCYDD="FRCYDD";
	public final static String POPDCC="POPDCC";
	
	public final static String INPUT_DEBIT_ORG_ACC_NO="INPUT_DEBIT_ORG_ACC_NO";
	
	
	public final static String TOKEN_DATA="TOKEN_DATA";
	public final static String BILL_AMOUNT="BILL_AMOUNT";
	
	
	public final static String INPUT_DEBIT_BANK="INPUT_DEBIT_BANK";
	
	public final static String ACC_TYPE_DESC="ACC_TYPE_DESC";
	public final static String BENE_ACC_TYPE_DESC="BENE_ACC_TYPE_DESC";
	
	public final static String BENE_BRANCH_BRNCH="BENE_BRANCH_BRNCH";
	
	public final static String REINIT_REASON="REINIT_REASON";
	
	public final static String OD_HOST_STATUS="OD_HOST_STATUS";
	
	public final static String BENE_BRNCH_CNTRY ="BENE_BRNCH_CNTRY";
	
	public final static String BENE_BANK_NAME_TEXT ="BENE_BANK_NAME_TEXT";
	public final static String BENE_BNK_NAME ="BENE_BANK_NAME";
	
	public final static String REJECT_BY ="REJECT_BY";
	public final static String CNCL_REASON ="CNCL_REASON";
	public final static String RE_AUTH_FLAG ="RE_AUTH_FLAG";
	public final static String OD_REJECT_REASON ="OD_REJECT_REASON";
	
	public final static String OD_ACC_TYPE_FROM ="od_acc_type_from";
	public final static String OD_CCY_CODE_FROM ="od_ccy_code_from";
	public final static String OD_CIF_FROM ="od_cif_from";
	
	public final static String STATUS_REJECTED_BY_APPROVER = "RO";	
	public final static String STATUS_ACCEPTED_BY_HOST = "AH";
	public final static String STATUS_CANCELLED = "CN";

	public final static String BENE_BRNCH_CITY = "BENE_BRNCH_CITY";
	public final static String ADD_DETAIL = "ADD_DETAIL";
	public final static String SYSTEM = "SYSTEM";
	public final static String BATCH = "BATCH";
	public final static String SINGLE = "SINGLE";

	public final static String SI_HOST_REF_NO = "SI_HOST_REF_NO";

	public final static String BENE_BANK_SWIFT_CD = "BENE_BANK_SWIFT_CD";
	public final static String BENE_ADD_INFO = "BENE_ADD_INFO";

	public final static String HEADER_DATA = "HEADER_DATA";
	public final static String DEBIT_MAP = "DEBIT_MAP";
	public final static String TXN_MAP = "TXN_MAP";
	public final static String TEMP = "TEMP";
	public final static String CALC_NOPLPD = "CALC_NOPLPD";

	public final static String HOLIDAY_LIST = "HOLIDAY_LIST";

	public final static String FETCH_HOLIDAY_HOLIDAY_SELECT = "FETCH_HOLIDAY_HOLIDAY_SELECT";
	public static final String YEARLY_DESC = "Yearly";
	public static final String MONTHLY_DESC = "Monthly";
	public static final String DAILY_DESC = "Daily";
	public static final String YEARLY_CODE = "Y";
	public static final String MONTHLY_CODE = "M";
	public static final String DAILY_CODE = "D";
	public static final String BRANCH_NAME = "BRANCH_NAME";
	public static final String DELETE = "DELETE";
	public static final String VIEW = "VIEW";
	public static final String EDIT = "EDIT";
	public static final String PAYMNT = "PAYMNT";
	public static final String USED_PAY_LIMIT = "USED_PAY_LIMIT";
	public static final String AVAIL_PAY_LIMIT = "AVAIL_PAY_LIMIT";
	public static final String TOTAL_AMT_DONE = "TOTAL_AMT_DONE";
	public static final String SI_EXEC_FREQ_LIST_CODE = "SI_EXEC_FREQ_LIST_CODE";
	public static final String SI_EXEC_FREQ_LIST_DESC = "SI_EXEC_FREQ_LIST_DESC";
	public static final String HOLIDAY_DATE = "holiday_date";
	public static final String CURRENT_BUSINESS_DATE = "CURRENT_BUSINESS_DATE";
	public static final String BASE_CURRENCY = "BASE_CURRENCY";

	public static final String IS_CONFORM_PAGE_REQD = "IS_CONFORM_PAGE_REQD";
	public static final String TRUE_SMALL = "true";
	public static final String ACCRUED_DEBIT = "ACCRUED_DEBIT";
	public static final String RETURNED_DATE = "RETURNED_DATE";
	public static final String CONFORM_SUBMIT = "CONFORM_SUBMIT";
	public static final String TEMPLATE = "Template";
	public static final String CONF = "conf";
	public static final String balanceTimeFormat = "dd-MM-yyyy hh:mm:ss a zzz";
	public static final String CREATE = "CREATE";
	public static final String INIT = "INIT";
	public static final String DETAIL = "DETAIL";
	public static final String INPUT_FROZEN_AMT = "INPUT_FROZEN_AMT";
	public static final String INPUT_OVERDRAFT_LIMIT = "INPUT_OVERDRAFT_LIMIT";
	public static final String INPUT_AVAILABLE_BAL = "INPUT_AVAILABLE_BAL";
	public static final String RES_BLOCKAMT = "res_Blockamt";
	public static final String RES_OD_LT = "res_OD_Lt";
	public static final String RES_AVAIL_BAL = "res_Avail_Bal";
	public static final String RES_SEG_RESULT_CODE = "res_Seg_Result_Code";
	public static final String _00000 = "00000";
	public static final String RES_ACC_NO = "res_Acc_No";
	public static final String ALL_RECORDS = "ALL_RECORDS";
	public static final String RECORDS = "RECORDS";
	public static final String REQUEST_HANDLER = "REQUEST_HANDLER";
	public static final String CIB2AS = "CIB2AS";
	public static final String ACC_NO = "ACC_NO";
	public static final String NO_OF_SEG = "No_Of_Seg";
	public static final String DESCRIPTION = "DESCRIPTION";
	public static final String CODE = "CODE";
	public static final String FULLCCYLIST2 = "FULLCCYLIST";
	public static final String FULLCLIST = "FULLCountryList";
	public static final String TRANSACTION = "Transaction";
	public static final String RULE_SELECTION = "RULE_SELECTION";
	public static final String WORKFLOW_DETAILS = "WORKFLOW_DETAILS";
	public static final String REFVALUE = "refvalue";
	public static final String DEL_TXN = "DEL_TXN";
	public static final String BENE_SAVE = "BENE_SAVE";
	public static final String INIT_ACTION = "INIT_ACTION";
	public static final String REDIRECT_PAYMENT_BALANCE = "REDIRECT_PAYMENT_BALANCE";
	public static final String LIBRARY_LOOKUP_ACTION = "__LIBRARY_LOOKUP_ACTION";
	public static final String BENE_DETAIL = "BENE_DETAIL";
	public static final String BENE_VIEW = "BENE_VIEW";
	public static final String BENE_CLEAR = "BENE_CLEAR";
	public static final String BENE_CREATE = "BENE_CREATE";
	public static final String REDIRECT_INVOICE_DETAILS = "REDIRECT_INVOICE_DETAILS";
	public static final String ADDITIONAL_DETAILS = "ADDITIONAL_DETAILS";
	public static final String VIEW_ERROR = "VIEW_ERROR";
	public static final String REDIRECT_SEARCH = "REDIRECT_SEARCH";
	public static final String BENE_SEARCH = "BENE_SEARCH";
	public static final String BENE_SEARCH_DETAIL = "BENE_SEARCH_DETAIL";
	public static final String INVOICE_CLOSE = "INVOICE_CLOSE";
	public static final String INVOICE_SAVE = "INVOICE_SAVE";
	public static final String CANCEL = "CANCEL";
	public static final String MULTIPLE_CONTINUE = "MULTIPLE_CONTINUE";
	public static final String MULTIPLE_CLOSE = "MULTIPLE_CLOSE";
	public static final String BENE_ADHOC = "BENE_ADHOC";
	public static final String BENE_ADHOC_CREATE = "BENE_ADHOC_CREATE";
	public static final String BENE_CLOSE = "BENE_CLOSE";
	public static final String VIEW_BENE = "VIEW_BENE";
	public static final String TXN_VIEW = "TXN_VIEW";
	public static final String BENE_DETAILS_BANK = "beneDetails_Bank";
	public static final String FROM_BENE_LIST = "fromBeneList";
	public static final String CALLFROM = "CALLFROM";
	public static final String BENEBANKDETAIL = "BENEBANKDETAIL";
	public static final String BENEACCDETAIL = "BENEACCDETAIL";
	public static final String BENEADDRDETAIL = "BENEADDRDETAIL";
	public static final String BENE_DETAILS_CITY = "beneDetails_City";
	public static final String BENE_DETAILS_COUNTRY = "beneDetails_Country";
	public static final String BENE_DETAILS_CURRENCY = "beneDetails_Currency";
	public static final String CLEARED = "cleared";
	public static final String FAILURE = "failure";
	public static final String SUCCESS = "success";
	public static final String PROCESS_DATE_TIME = "PROCESS_DATE_TIME";
	public static final String ERR_CODE = "ERR_CODE";
	public static final String STATUS = "STATUS";
	public static final String EDIT_TXN = "EDIT_TXN";
	public static final String REDIRECT_BENE = "REDIRECT_BENE";
	public static final String PAYMENT = "PAYMENT";
	public static final String MULTIPLE = "MULTIPLE";
	public static final String INTER_BANK = "INTER_BANK";
	public static final String INDEX_VALUE = "INDEX_VALUE";
	public static final String REF_VALUE = "REF_VALUE";
	public static final String USE_SEARCH_CRITERIA_MAP = "USE_SEARCH_CRITERIA_MAP";
	public static final String SEARCH_CRITERIA_MAP = "SEARCH_CRITERIA_MAP";
	public static final String SEARCHKEY = "SEARCHKEY";
	public static final String SEARCHVALUES = "SEARCHVALUES";
	public static final String BENE_BANK_NAME_VALUE = "BeneBankNameValue";
	public static final String SITRANSACTION = "SITransaction";
	public static final String TELETRANSF_DAM_KEY = "TELETRANSF_DAM_KEY";
	public static final String GET_BANK_DETAILS = "GET_BANK_DETAILS";
	public static final String CHARGES_TO_DESC = "CHARGES_TO_DESC";
	public static final String CHARGES_TO_CODE = "CHARGES_TO_CODE";
	public static final String PAY_CYCLE_CODE = "PAY_CYCLE_CODE";
	public static final String BENE_ADDNL_TYPE_CODE = "BENE_ADDNL_TYPE_CODE";
	public static final String PAY_CYCLE_DESC = "PAY_CYCLE_DESC";
	public static final String PAY_TYPE_CODE = "PAY_TYPE_CODE";
	public static final String PAY_TYPE_DESC = "PAY_TYPE_DESC";
	public static final String BENE_ADDNL_TYPE_DESC = "BENE_ADDNL_TYPE_DESC";
	public static final String DELV_METH_DESC = "DELV_METH_DESC";
	public static final String DELV_METH_CODE = "DELV_METH_CODE";
	public static final String PAY_EVERY_CODE = "PAY_EVERY_CODE";
	public static final String PAY_EVERY_DESC = "PAY_EVERY_DESC";
	public static final String COLLECT_BRANCH = "COLLECT_BRANCH";
	public static final String WEAK_CODE = "WEAK_CODE";
	public static final String WEAK_DESC = "WEAK_DESC";
	public static final String IF_HOLIDAY_CODE = "IF_HOLIDAY_CODE";
	public static final String IF_HOLIDAY_DESC = "IF_HOLIDAY_DESC";
	public static final String BENE_SWIFT_CODE = "BENE_SWIFT_CODE";
	public static final String INTER_BANK_LIST = "INTER_BANK_LIST";
	public static final String CURRENCY = "Currency";

	public static final String CHQ_OPTION = "CHQ_OPTION";
	public static final String RSA_TOKEN_VAL = "RSA_TOKEN_VAL";
	public static final String TXN_SEND = "TXN_SEND";
	public static final String REJECT_TXN = "REJECT_TXN";
	public static final String SELECTED_RECORDS = "SELECTED_RECORDS";
	public static final String PRE_REJECT_TXN = "PRE_REJECT_TXN";
	public static final String PRE_EDIT_TXN = "PRE_EDIT_TXN";

	public static final String GET_BAL_INFO = "GET_BAL_INFO";
	public static final String GET_ACC_INFO = "GET_ACC_INFO";
	public static final String GET_TXN_SUM_INFO = "GET_TXN_SUM_INFO";

	public static final String UTIL_CD = "UTIL_CD";

	public static final String BENE_VALIDATION = "BENE_VALIDATION";

	public static final String CANCEL_FUTURE_TXN = "CANCEL_FUTURE_TXN";

	public static final String CANCELTRANSACTION = "CANCELTRANSACTION";

	public static final String MATCH = "MATCH";

	public static final String AMOUNT_TYPE = "AMOUNT_TYPE";
	public static final String CUT_OFF_TIME = "CUT_OFF_TIME";
	public static final String GETPAYMODE = "GETPAYMODE";
	public static final String PURPOSE = "PURPOSE";
	public static final String CDFLAG = "CDFLAG";
	public static final String DEBT_CURRENCY = "DEBIT_CURRENCY";
	public static final String UTILITY_SERVICE_PROVIDER_NAME = "UTILITY_SERVICE_PROVIDER_NAME";
	public static final String UTIL_ACC_TYPE = "UTIL_ACC_TYPE";
	public static final String EDIT_CONFORM_SUBMIT = "EDIT_CONFORM_SUBMIT";
	public static final String APPROVE_ACTION = "AUTH_TXN";
	public static final String PAYMENT_TYPE_NEEDED = "PAYMENT_TYPE_NEEDED";
	public static final String TYPE_REM = "TYPE_REM";
	public static final String TYPE_SO = "TYPE_SO";
	public static final String AUTH_TXN = "AUTH_TXN";

	public static final String SAVE_TXN = "SAVE_TXN";
	public static final String UPDATE_TXN = "UPDATE_TXN";
	public static final String GET_TXN = "GET_TXN";
	public static final String REAUTH_TXN = "REAUTH_TXN";
	public static final String CANCEL_TXN = "CANCEL_TXN";
	public static final int CHANNEL_ID_POS = 10;
	public static final int TXN_CODE_POS = 1;

	public static final String IS_PRECONFIRM_CANCEL = "IS_PRECONFIRM_CANCEL";

	public static final String DELIVERY_METHOD_LIST = "DELIVERY_METHOD_LIST";
	public static final String COLLECTION_BRANCH_LIST = "COLLECTION_BRANCH_LIST";
	public static final String PAYMENT_LOCATION_LIST = "PAYMENT_LOCATION_LIST";
	public static final String PAYMENT_SAVE_TEMPLATE = "SAVE_TEMP";
	public static final String AT_BRNCH = "At Branch";
	public static final String BY_MAIL = "By Mail";
	
	public static final String AT_COLL_OFF = "At Corporate Office";
	public static final String AT_COLL_BRANCH = "At Corporate Branch";
	
	public static final String CNTRY_DD = "CNTRY_DD";
	public static final String BEN_CRNCY = "BEN_CRNCY";

	public static final String GET_REASON = "GET_REASON";
	public static final String INPUT_REFERENCE_NO = "INPUT_REFERENCE_NO";

	public static final String FREQ_UNIT = "FREQ_UNIT";
	public static final String ELAPSED_PAY = "ELAPSED_PAY";
	public static final String DEBTOR_SUBPROD = "LIBR";
	public static final String TEMPLATE_REFRNCE_NO = "TEMPLATE_REF_NO";
	
	public final static String PAYEE_TYPE="payee_type";
	public final static String ALIAS_NAME="alias_name";
	public final static String PAY_REG_FLG="pay_reg_flag";
	
	public final static String ADD_REF="add_ref";
	
	public final static String accData = "accData";
	public final static String refNO = "REFERENCE_NO";
	public final static String FETCH_DIVIDEND_DATA = "FETCH_DIVIDEND_DATA";
	public final static String INPUT_REF_NO = "INPUT_REF_NO";
	public final static String DIVIDEND_PAY = "DIVIDEND_PAY";
	public final static String VIEW_DETAILS = "VIEW_DETAILS";
	public final static String BEN2AS = "BEN2AS";
	
	public final static String DEBIT_ALIAS_NAME="deb_alias_name";
	public final static String RECPAY="RECPAY";
	public static final String FUTURE_DATE = "FUTURE_DATE";
	public static final String HOSTCODE_SHIPGRT = "SPGRT";
	public static final String GET_SHIP_ISSUANCE_BASIC_DETAILS = "GET_SHIP_ISSUANCE_BASIC_DETAILS";//CHG_TRADE_POC
	public static final String SG_REF_NO = "GUAR_REF_NO";
	public static final String GET_SHIP_BENE_DETAILS = "GET_SHIP_BENE_DETAILS";
	public static final String GET_SHIP_SHIPMENT_DETAILS = "GET_SHIP_SHIPMENT_DETAILS";
	public static final String GET_SHIP_ADDITIONAL_DETAILS = "GET_SHIP_ADDITIONAL_DETAILS";
	public static final String CURRENCY_TRADE = "CURRENCY_TRADE";
	public static final String ESTIMATED_FEE = "ESTIMATED_FEE";
	public static final String ESTIMATED_FEE_CURR = "ESTIMATED_FEE_CURR";
	public static final String ESTIMATED_FEE_ERR = "ESTIMATED_FEE_ERR";
	public static final String ESTIMATED_FEE_ERRCODE = "PYTFEEERR";
	public static final String ESTIMATED_FEE_ERROR = "ESTIMATED_FEE_ERROR";
	public static final String ACTUAL_FEE = "ACTUAL_FEE";
	public static final String ACTUAL_FEE_CURR = "ACTUAL_FEE_CURR";
	public static final String ADDITIONAL_TXN_DATA = "ADDITIONAL_TXN_DATA";

	public static final String OLD_REF_NO = "OLD_REF_NO";
	public static final String OD_AUTH_ID = "OD_AUTH_ID";
	public static final String FUTURE_DATE_KEY = "FT_DATE";
	public static final String FETCH_FUTURE_DATE = "FETCH_FUTURE_DATE";
	public static final String OD_DESCRIPTION = "OD_DESCRIPTION";		
	public static final String HOSTCODE_LCCONF = "LCCONF";
	public static final String GET_LC_CONF_OTHER_DETAILS = "GET_LC_CONF_OTHER_DETAILS";
	public static final String LC_REF_NO = "LC_REF_NO";
	public static final String HOSTCODE_CRPO = "CRPO";		
	public static final String DEBAMT = "DEBAMT"; 
	public static final String PYTAMT = "PYTAMT"; 
	public static final String DEB_AMT_RADIO = "DEB_AMT_RADIO"; 
	public static final String ADDRESS_5 = "address_5"; 
	public static final String ADD_FLD22 = "ADD_FLD2";		
	public static final String ADD_REF_NO="add_ref";
	public static final String AT_BRANCH="AT_BRNCH";
	public static final String REJECT="REJECT"; 
	public static final String NO_OF_TXNS_DONE="NO_OF_TXNS_DONE";
	public static final String AVAIL_NO_UPLOAD="AVAIL_NO_UPLOAD";
	public static final String USED_NO_UPLOAD="USED_NO_UPLOAD";
	public static final String INPUT_VALUE_DATE="INPUT_VALUE_DATE";
	public static final String INPUT_DEBIT_CURRENC="INPUT_DEBIT_CURRENCY";
	public static final String INPUT_DEBIT_ACC_NO="INPUT_DEBIT_ACC_NO";
	public static final String INPUT_DEBIT_AMOUNT="INPUT_DEBIT_AMOUNT";
	public static final String ECONOMIC_ACTIVITY="economicActivity";
	public static final String CURRENCY_IDR="IDR";
	public static final String TST_OPTION="tstOptionValue";
	public static final String BENE_CITIZENSHIP="beneCitizenShip";
	public static final String CHARGE_AMT="CHARGE_AMT";
	public static final String TXN_DATE="TXN_DATE"; 
	public static final String INLIEU_CHARGE_AMT="INLIEU_CHARGE_AMT";
	public static final String PAY_IN_FULL_CHARGE_AMT="PAY_IN_FULL_CHARGE_AMT";
	public static final String OLD_TXN_STATUS = "OLD_TXN_STATUS";
	public static final String CURRENCY1="IDR"; 	  	 
    public static final String CURRENCY2="SGD"; 	  	 
    public static final String CURRENCY3="USD";
    public static final String BANK_CODE="bank_code";
    public final static String HOSTCODE_UPINIT = "UPINIT";	
	public static final String BENE_NAME_ADDRESS = "BENE_NAME_ADDRESS";
	public static final String BENE_BIC_TYPE = "BENE_BIC_TYPE";
	public static final String BENE_STATE = "BENE_STATE";
	public static final String CURRENCY_VALIDATION = "CURRENCY_VALIDATION";
	public static final String GENERIC_RADIO = "GENERIC_RADIO";
	public static final String BENE_ADDNL_INFO = "BENE_ADDNL_INFO";
	public static final String LLD_LIMIT_VALIDATION = "LLD_LIMIT_VALIDATION";
	public static final String LLD_FLAG = "LLD_FLAG";
	public static final String SEND_CONTACT_NAME = "SEND_CONTACT_NAME";
	public static final String SEND_CONTACT_NO = "SEND_CONTACT_NO";
	public static final String COUNTRY_CODE = "COUNTRY_CODE";
	public final static String APP_ID_DWN = "CIB2STMCYCDWN";
	public static final String SERVICE_TYPE_CODE="SERVICE_TYPE_CODE";
	public static final String INLIEU_CHARGECCY="inlieu_chargeccy";		
	public static final String INLIEU_CHARGEAMT="inlieu_chargeamt";
	public static final String INLIEU_CHARGERATE="inlieu_chargerate";
	public static final String INLIEU_CHARGESELLRATE="inlieu_chargesellrate";
	public static final String PAYINFULL_CHARGECCY="payInFull_chargeCcy";
	public static final String PAYINFULL_CHARGEAMT="payInFull_chargeAmt";
	public static final String PAYINFULL_CHARGERATE="payInFull_chargeRate";
	public static final String PAYINFULL_CHARGEEQUIV="payInFull_chargeEquiv";
	public static final String PAYINFULL_CHARGESELLRT="payInFull_chargeSellRt";
	public static final String SENDER_CONTACT_NAME="sender_contact_name";
	public static final String SENDER_PHONE="sender_phone";
	public static final String LLD_LIMIT_FLG="lld_limit_flg";
	public static final String LLD_NAME="lld_name";
	public static final String LLD_ADDRESS1="lld_address1";
	public static final String LLD_ADDRESS2="lld_address2";
	public static final String LLD_DATE="lld_date";
	public static final String LLD_POSTAL_CODE="lld_postal_code";
	public static final String LLD_PHONE_NO="lld_phone_no";
	public static final String LLD_PP_CAT="lld_pp_cat";
	public static final String LLD_PP_CAT_CD="lld_pp_cat_cd";
	public static final String LLD_IS_SENDER_BENE="lld_is_sender_bene";
	public static final String LLD_SENDER_NATIONALITY="lld_sender_nationality";
	public static final String LLD_SENDER_CATEGORY="lld_sender_category";
	public static final String LLD_SENDER_BENE_FIN_RELTN="lld_sender_bene_Fin_reltn";
	public static final String LLD_BENE_NATIONALITY="lld_bene_nationality";
	public static final String LLD_BENE_CAT="lld_bene_cat";
	public static final String INPUT_CREDIT_AMOUNT_CURR="INPUT_CREDIT_AMOUNT_CURR";
	public static final String CORPORATE_NAME = "CORPORATE_NAME";
	public static final String PAYMENT_DAM_KEY_PENDING_TXNS = "STND_INST_PENDING_TXNS";
	public static final String SI_REF_NO = "SI_REF_NO";
	public static final String BENE_CUST_NAME = "BENE_CUST_NAME";
	public static final String DEBIT_CUST_NAME = "DEBIT_CUST_NAME";
}
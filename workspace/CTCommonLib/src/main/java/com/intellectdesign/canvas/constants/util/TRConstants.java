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
 * This class contains the TR Constants
 * 
 * @version 1.0
 */
public class TRConstants
{
	/**
	 * Private cnstructor to avoid instantiation. ref to TRConstants
	 */
	private TRConstants()
	{

	}

	public final static int TXNSTATUS_POS = 15;
	public final static int REFERENCE_NO_POS = 11;
	public final static int CONFIRMSCR_POS = 19;
	public final static int CHUNK_LIMIT = 4000;
	public final static String NICK_NAME = "NICK_NAME";
	public final static int SWIFT_MIN_LT = 8;
	public final static int SWIFT_MAX_LT = 11;
	public final static int ADDR_LINE_LT = 3;
	public final static int ADDR_CHAR_LT = 35;
	public final static int DETL_CHAR_LT = 65;
	public final static int CONT_CHAR_LT = 100;

	public final static String CLAUSE_GD = "GD";
	public final static String CLAUSE_DS = "DS";
	public final static String CLAUSE_SI = "SI";
	public final static String CLAUSE_MN = "MN";
	public final static String CLAUSE_AC = "AC";
	public final static String CLAUSE_TC = "TC";

	public final static String NAME_SP = "<>%':;&^$#!~`{}[]|\\/\"!@^&*(),.?";
	public final static String CODE_SP = "<>%':;&^$#!~`{}[]|\\/\"!@^&*(),.? ";
	public final static String TA_SP = "<>'";

	public final static String ACC_LIST = "ACC_LIST";
	public final static String ACC_DETAILS = "ACC_DETAILS";
	public final static String TRANS_MEDIUM = "TRANS_MEDIUM";
	public final static String LC_SET_CACHE_PRODUCT = "CAHCE_PRODUCT";
	public final static String LC_SET_CACHE_TRANS = "transmedium";
	public final static String LC_SET_CACHE_BRANCH = "CACHE_BRANCH";
	public final static String LC_SET_CACHE_DEBIT_CURRENCY = "DEBIT_CURRENCY";
	public final static String BRANCH = "BRANCH";
	public final static String CCY_LIST = JSPIOConstants.INPUT_DEBIT_CURRENCY;
	public final static String LC_SET_CACHE_CCY = "cache_currency";
	public final static String UNDER_LC = "UNDER_LC";
	public final static String CURRENCY = JSPIOConstants.INPUT_DEBIT_CURRENCY;
	public final static String TCURRENCY = "TakeDownCurrency";
	public final static String TAKE_DOWN_ACC = "TAKE_DOWN_ACC";
	public final static String ODTXN_TYPE = "TransType";
	public final static String SHIP_DATE = "LstShDat";
	public final static String SHIPDOC_DATE = "SHIPDOC_DATE";
	public final static String SHIPDOC_NO = "SHIPDOC_NO";
	public final static String SHIP_MODE = "SHIP_MODE";
	public final static String MARKS_NUMBER = "MARKS_NUMBER";
	public final static String REQ_DATE = JSPIOConstants.INPUT_VALUE_DATE;
	public final static String REQDATE_FROM = "REQDATE_FROM";
	public final static String REQDATE_TO = "REQDATE_TO";
	public final static String ISSDATE_FROM = "ISSDATE_FROM";
	public final static String ISSDATE_TO = "ISSDATE_TO";
	public final static String EXPDATE_FROM = "EXPDATE_FROM";
	public final static String EXPDATE_TO = "EXPDATE_TO";
	public final static String EXP_DATE = "ExpDat";
	public final static String LC_AMT = JSPIOConstants.INPUT_DEBIT_AMOUNT;
	public final static String LC_REF = "LcRef";
	public final static String GUARANTEE_AMT = JSPIOConstants.INPUT_DEBIT_AMOUNT;
	public final static String POS_TOLERANCE = "Tolerance";
	public final static String NEG_TOLERANCE = "Tol";
	public final static String POS_TOL = "pos_Tol";
	public final static String NEG_TOL = "neg_Tol";
	public final static String ADD_AMT = "AddAmt";
	public final static String DESC_ADD_AMT = "DescAdAmt";
	public final static String MAX_CRDT = "MaxCdt";
	public final static String CUST_REF = "your_ref";
	public final static String CUST_NUMBER = "CUST_NUMBER";
	public final static String EXP_LOC = "ExpPlace";
	public final static String CONF_INSTR = "ConIns";
	public final static String SPECIFY_CONDIFTION = "specify_condition";
	public final static String BANK_SWIFTCODE = "BankSwiftCode";
	public final static String SWIFT_CODE = "SwiftCode";
	public final static String BANK_NAME = "BankName";
	public final static String BANK_ID = "BANK_ID";
	public final static String BANK_CODE = "BANK_CODE";
	public final static String BRANCH_CODE = "BRANCH_CODE";
	public final static String BANK_GEN_NAME = "Bank_gen_name";
	public final static String BANK_ADD = "BankAdd";
	public final static String BANK_ADDRESS = "BANK_ADDRESS";
	public final static String REVOLVING = "revolving";
	public final static String REVOKING = "revoking";
	public final static String TRANSFERABLE = "transferable";
	public final static String REV_CRDT_DETAIL = "revolving_detail";
	public final static String BENE_NAME = "Name";
	public final static String BENE_ADDRESS = "address";
	public final static String BENE_ADD = "add";
	public final static String BENE_ID = "BENE_ID";
	public final static String DRAFT_CODE = "draft_bank_code";
	public final static String DRAFT_NAME = "draft_bank_name";
	public final static String DRAFT_ADD = "draft_bank_add";
	public final static String PAY_TERMS = "PayTerms";
	public final static String AVAIL_WITH = "AvbWith";
	public final static String AVAIL_BY = "AvbBy";
	public final static String SHIP_FROM = "ShFrm";
	public final static String SHIP_TO = "ShipTo";
	public final static String SHIP_PERIOD = "Ship_period";

	public final static String CONDITIONS_AGREED = "CONDITIONS_AGREED";
	public final static String PAR_SHIP = "par_ship";
	public final static String TRANS_SHIP = "trans_ship";
	public final static String PER_PRESENTATION = "period_presentation";
	public final static String CHANGE_NATURE = "chng_nature";
	public final static String CHANGE = "chng";
	public final static String CHANGE_AMT = "chng_amt";
	public final static String RE_INSTATED = "reinstated";
	public final static String GOODS_DESC = "Goods_desc";
	public final static String MARKS_NO = "MARKS_NO";
	public final static String DOCS_REQ = "Docs_req";
	public final static String ADD_CONDITION = "Add_cond";
	public final static String SPECIAL_INSTRUCTION = "Special_instruction";
	public final static String DECLARATION = "Declaration";
	public final static String DOCS_SUBMIT = "Docs_submit";
	public final static String UN_GUARANTEE = "Unlimited_guarentee";
	public final static String CONTRACT_DATE = "Contract_date";
	public final static String CONTRACT_NO = "Contract_no";
	public final static String CONTRACT_DETAILS = "Contract_details";
	public final static String CARRIER_DETAILS = "CARRIER_DETAILS";
	public final static String LANG_CODE = "lang_code";
	public final static String TERMS_CONDITION = "terms_cond";
	public final static String AGREE = "agreement";
	public final static String STATUS = "status";
	public final static String LC_STATUS = "LC_STATUS";
	public final static String DEBIT_TO_ACC = "DEBIT_TO_ACC";
	public final static String DEBIT_ACC_CCY = "DEBIT_ACC_CCY";
	public final static String DEBIT_AMOUNT = "DEBIT_AMOUNT";
	public final static String DEBIT_AMT_CCY = "DEBIT_AMT_CCY";
	public final static String PAYMENT_DATE = "PAYMENT_DATE";
	public final static String REQ_LOAN = "REQ_LOAN";
	public final static String INC_CHG_LOAN = "INC_CHG_LOAN";
	public final static String DATE_VALUE = "iss_date";
	public final static String CUSTOMER_NO = "cust_no";
	public final static String CUSTOMER_BRANCH = "cust_branch";
	public final static String AMEND_REQUEST = "amend_req";
	public final static String ADVICE_SWIFT_CODE = "advice_swift_code";
	public final static String ADVICE_SWIFT_NAME = "advice_swift_name";
	public final static String ADVICE_SWIFT_ADD = "advice_swift_add";
	public final static String AVAIL_AMT = "avail_amt";
	public final static String HOST_AMEND_SEQ_NO = "host_amend_seq_no";
	public final static String SET_AVAIL_BY = "cache_avail_by";
	public final static String SET_CONFIRM_INSTR = "cache_confirm_instr";
	public final static String MESSAGE = "error";
	public final static String INQUIRY = "inqury";

	public final static String MODE = JSPIOConstants.INPUT_MODE;
	public final static String SESSION_ID = JSPIOConstants.INPUT_SESSION_ID;
	public final static String DEBIT_ACC_NO = JSPIOConstants.INPUT_DEBIT_ACC_NO;
	public final static String USER_NO = JSPIOConstants.INPUT_USER_NO;
	public final static String TXN_STATUS = JSPIOConstants.INPUT_TXN_STATUS;
	public final static String ACTION = JSPIOConstants.INPUT_ACTION;
	public final static String CONFIRMATION = JSPIOConstants.INPUT_CONFIRMATION;
	public final static String CHANNEL_ID = JSPIOConstants.INPUT_CHANNEL_ID;
	public final static String REFERENCE_NO = JSPIOConstants.INPUT_REFERENCE_NO;
	public final static String VER_NO = JSPIOConstants.INPUT_VER_NO;
	public final static String LANGUAGE_ID = JSPIOConstants.INPUT_LANGUAGE_ID;
	public final static String CUST_TYPE = JSPIOConstants.INPUT_CUST_TYPE;
	public final static String LC_PRODUCT = "Prd";
	public final static String SUB_PRODUCT = JSPIOConstants.INPUT_SUB_PRODUCT;
	public final static String PRODUCT = JSPIOConstants.INPUT_PRODUCT;
	public final static String PRODUCT_LIST = "PRODUCT_LIST";

	public final static String SEARCH_PRODUCT = "SEARCH_PRODUCT";

	public final static String FUNCTION_CODE = JSPIOConstants.INPUT_FUNCTION_CODE;
	public final static String VALIDATE_STATUS = "VALIDATE_STATUS";
	public final static String DEBIT_BRANCH = JSPIOConstants.INPUT_DEBIT_BRANCH;
	public final static String CREATED_BY = "CREATED_BY";
	public final static String CREATED_DATE = "createdDate";
	public final static String MODIFIED_BY = "MODIFIED_BY";
	public final static String MODIFIED_DATE = "modifiedDate";
	public final static String HOST_AMND_SEQ_NO = "HOST_AMND_SEQ_NO";
	public final static String GCIF = JSPIOConstants.INPUT_GCIF;
	public final static String ERROR_CODE = "ERROR_CODE";
	public final static String ERROR_DESC = "ERROR_DESC";
	public final static String DECLARATION_ID = "DECLARATION_ID";
	public final static String MSG_TYPE = "MSG_TYPE";
	public final static String HOST_RELEASE_DT = "HOST_RELEASE_DT";
	public final static String HOST_RECEIVE_DT = "HOST_RECEIVE_DT";
	public final static String SHORT_DESC = "shortDesc";
	public final static String CLAUSE_TYPE = "clauseType";
	public final static String CONTENT = "CONTENT";
	public final static String CONTENT_ID = "CONTENT_ID";
	public final static String CLAUSE_ID = "clauseId";
	public final static String CLAUSES_ERROR = "clauseerror";
	public final static String TI_TYPE = "ti_type";

	public final static String HOST_REF = "HOST_REF";
	public final static String CIB_REF = "CIB_REF";
	public final static String ISSUE_DATE_FROM = "ISSUE_DATE_FROM";
	public final static String ISSUE_DATE_TO = "ISSUE_DATE_TO";
	public final static String ISSUE_DATE = "ISSUE_DATE";
	public final static String EXPIRY_DATE_FROM = "EXPIRY_DATE_FROM";
	public final static String EXPIRY_DATE_TO = "EXPIRY_DATE_TO";
	public final static String HOST_STATUS = "HOST_STATUS";

	public final static String BG_SET_CACHE_PRODUCT = "BG_SET_CACHE_PRODUCT";
	public final static String BG_SET_CACHE_SUB_PRODUCT = "BG_SET_CACHE_SUB_PRODUCT";
	public final static String BG_SET_CACHE_PRODUCT_DES = "BG_SET_CACHE_PRODUCT_DES";
	public final static String BG_SUB_PRODUCT = "subPrd";
	public final static String BG_UN_LMT_GT = "unLimitGt";
	public final static String BG_CONTRACT_DT = "contractDt";
	public final static String BG_CONTRACT_NO = "contractNo";
	public final static String BG_CONTRACT_DETAIL = "contractDetail";
	public final static String BG_TERMS_CONDITIONS = "termsConditions";
	public final static String BG_DOCS_SUBMIT = "docsSubmit";
	public final static String BG_SPL_INS = "splInstructions";
	public final static String BG_ISS_DEC = "BGIDeclaration";
	public final static String BG_AGREE_COND = "BGAgreeCond";
	public final static String TEMP_PAGE = "TEMP_PAGE";
	public final static String ERROR_LIST = "ERROR_LIST";
	public final static String BENE_ERROR_LIST = "BENE_ERROR_LIST";
	public final static String DEC_ERROR_LIST = "DEC_ERROR_LIST";
	public final static String LC_FLAG = "LC_FLAG";
	public final static String DEBT_FLAG = "DEBT_FLAG";
	public final static String LOAN_FLAG = "LOAN_FLAG";
	public final static String CHG_FLAG = "CHG_FLAG";
	public final static String DECL_CONTENT = "DECL_CONTENT";
	public final static String DECL_CONTENT_ID = "TRADE_DECLARATION";
	public final static String AGREE_1 = "AGREE_1";
	public final static String AGREE_FLAG = "LC_AGREE";
	public final static String REVOKING_1 = "REVOKING_1";
	public final static String TRANSFERABLE_1 = "TRANSFERABLE_1";
	public final static String REVOLVING_1 = "REVOLVING_1";
	public final static String SEARCHKEY = "SEARCHKEY";
	public final static String SEARCHVALUES = "SEARCHVALUES";
	public final static String CHECK_MODE = "mode";
	public final static String BG_AME_MIN_CHANGE_FELDS = "BG_AME_MIN_CHANGE_FELDS";
	public final static String LC_AME_MIN_CHANGE_FELDS = "LC_AME_MIN_CHANGE_FELDS";
	public final static String BG_AME_ERROR_FLG = "BG_AME_ERROR_FLG";
	public final static String LC_AME_ERROR_FLG = "LC_AME_ERROR_FLG";
	public final static String HISTORY = "HISTORY";
	public final static String CORRESPONDENCE = "CORRESPONDENCE";
	public final static String CHARGES_SETTLES = "CHARGES_SETTLES";
	public final static String MSG_CONTENT = "MSG_CONTENT";
	public final static String OPERATION = "OPERATION";
	public final static String CORR_DATE = "CORR_DATE";
	public final static String CORR_DESC = "CORR_DESC";
	public final static String LANG = "LANG";

	public final static String LC_AMEND_LIST[] =
	{ HOST_REF, CUST_REF, CIB_REF, BENE_NAME, CUST_NUMBER, BRANCH, CURRENCY, LC_AMT, LC_PRODUCT, HOST_STATUS,
			REQDATE_FROM, REQDATE_TO, ISSDATE_FROM, ISSDATE_TO, EXPDATE_FROM, EXPDATE_TO };

	public final static String LC_AMEND_CHANGE_LIST[] =
	{ LC_AMT, POS_TOLERANCE, POS_TOL, NEG_TOLERANCE, NEG_TOL, ADD_AMT, DESC_ADD_AMT, MAX_CRDT, EXP_DATE, EXP_LOC,
			CONF_INSTR, AVAIL_WITH, BANK_SWIFTCODE, BANK_GEN_NAME, BANK_ADD, AVAIL_BY, ADVICE_SWIFT_CODE,
			ADVICE_SWIFT_NAME, ADVICE_SWIFT_ADD, REVOKING, TRANSFERABLE, REVOLVING, REV_CRDT_DETAIL, BENE_NAME,
			BENE_ADDRESS, DRAFT_CODE, DRAFT_NAME, DRAFT_ADD, PAY_TERMS, SHIP_FROM, SHIP_TO, SHIP_DATE, SHIP_PERIOD,
			PAR_SHIP, TRANS_SHIP, PER_PRESENTATION, GOODS_DESC, DOCS_REQ, ADD_CONDITION };

	public final static String BG_AMEND_CHANGE_LIST[] =
	{ UN_GUARANTEE, GUARANTEE_AMT, EXP_DATE, BENE_NAME, BENE_ADDRESS, CONTRACT_DATE, CONTRACT_NO, CONTRACT_DETAILS,
			TERMS_CONDITION };

	public final static String MATURITY_DATE_FROM = "MATURITY_DATE_FROM";
	public final static String MATURITY_DATE_TO = "MATURITY_DATE_TO";
	public final static String BILL_CCY = JSPIOConstants.INPUT_DEBIT_CURRENCY;
	public final static String BILL_AMT = JSPIOConstants.INPUT_DEBIT_AMOUNT;
	public final static String TRANSPORT_DOC_NO = "TRANSPORT_DOC_NO";
	public final static String TRANSPORT_DOC_DATE = "TRANSPORT_DOC_DATE";
	public final static String UNDER_SG = "UNDER_SG";
	public final static String INQ_SUB_PROD = "HSGISSREQ";
	public final static String INQ_SUB_PROD_VALUE = "Shipping Gaurantee";
	public final static String DISCREPANT = "DISCREPANT";

	public final static String START_INDEX = "START_INDEX";
	public final static int ROWS_PER_PAGE = 250;

	public final static String BILL_SEQ_NO = "BILL_SEQ_NO";
	public final static String LC_CCY = "LC_CCY";
	public final static String LC_AVAILABLE_AMT = "LC_AVAILABLE_AMT";
	public final static String SG_NUMBER = "SG_NUMBER";
	public final static String BILL_ADD_AMT = "BILL_ADD_AMT";
	public final static String BILL_AMT_PAID = "BILL_AMT_PAID";
	public final static String NEG_DATE = "NEG_DATE";
	public final static String DATE_RCPT_DOCS = "DATE_RCPT_DOCS";
	public final static String USANCE_EVENT = "USANCE_EVENT";
	public final static String EVENT_DATE = "EVENT_DATE";
	public final static String TENOR = "TENOR";
	public final static String FINANCED = "FINANCED";
	public final static String LOAN_AMOUNT = "LOAN_AMOUNT";
	public final static String LOAN_AMT_CCY = "LOAN_AMT_CCY";
	public final static String LOAN_START_DATE = "LOAN_START_DATE";
	public final static String LOAN_END_DATE = "LOAN_END_DATE";
	public final static String TRANS_MODE = "TRANS_MODE";
	public final static String TRANS_FROM = "TRANS_FROM";
	public final static String TRANS_TO = "TRANS_TO";
	public final static String BRIEF_GOOD_DESC = "BRIEF_GOOD_DESC";
	public final static String DISC_DETAILS = "DISC_DETAILS";
	public final static String PENDING_ACT = "PENDING_ACT";
	public final static String NEG_BEN_BANK_NAME = "NEG_BEN_BANK_NAME";
	public final static String NEG_BEN_BANK_SWIFT = "NEG_BEN_BANK_SWIFT";
	public final static String NEG_BEN_BANK_ADDRESS = "NEG_BEN_BANK_ADDRESS";

	public final static String BEN_BANK_NAME = "BEN_BANK_NAME";
	public final static String BEN_BANK_SWIFT = "BEN_BANK_SWIFT";
	public final static String BEN_BANK_ADDRESS = "BEN_BANK_ADDRESS";

	public final static String BENE_ACCOUNT = "BENE_ACCOUNT";
	public final static String MATURITY_DATE = "MATURITY_DATE";
	public final static String BUYER_NAME = "BUYER_NAME";
	public final static String APPLICANT_NAME = "APPLICANT_NAME";
	public final static String LC_NO = "LC_NO";

	public final static String SEQ_NO = "SEQ_NO";
	public final static String ADDITIONAL_AMT = "ADDITIONAL_AMT";
	public final static String TOTAL_AMT = "TOTAL_AMT";
	public final static String ADDITIONAL_AMT_DESC = "ADDITIONAL_AMT_DESC";
	public final static String EXPIRY_DATE = "EXPIRY_DATE";
	public final static String CONFIRM_INSTRUCTION = "CONFIRM_INSTRUCTION";
	public final static String CONFIRMED = "CONFIRMED";
	public final static String CONFIRM_AMT = "CONFIRM_AMT";
	public final static String AVAILABLE_WITH = "AVAILABLE_WITH";
	public final static String ADVISE_BANK_SWIFT_CODE = "ADVISE_BANK_SWIFT_CODE";
	public final static String ADVISE_BANK_NAME = "ADVISE_BANK_NAME";
	public final static String ADVISE_BANK_ADDRESS = "  ADVISE_BANK_ADDRESS";
	public final static String REVOCABLE = "REVOCABLE";
	public final static String REVOLVING_CREDIT_DTL = "REVOLVING_CREDIT_DTL";
	public final static String APPLICANT_ADDRESS = "APPLICANT_ADDRESS";
	public final static String DRAFT_BANK_SWIFT_CODE = "DRAFT_BANK_SWIFT_CODE";
	public final static String DRAFT_BANK_NAME = "DRAFT_BANK_NAME";
	public final static String DRAFT_BANK_ADDRESS = "DRAFT_BANK_ADDRESS";
	public final static String PAYMENT_TERMS = "PAYMENT_TERMS";
	public final static String LAST_SHIPMENT_DATE = "LAST_SHIPMENT_DATE";
	public final static String SHIPMENT_PERIOD = "SHIPMENT_PERIOD";
	public final static String PARTIAL_SHIPMENT = "PARTIAL_SHIPMENT";
	public final static String TRANS_SHIPMENT = "TRANS_SHIPMENT";
	public final static String PERIOD_SHIP_DOCS = "PERIOD_SHIP_DOCS";
	public final static String PORT_LAND = "PORT_LAND";
	public final static String PORT_DISCHARGE = "PORT_DISCHARGE";
	public final static String MAKER_NUMBER = "MAKER_NUMBER";
	public final static String SET_CACHE_CCY = "SET_CACHE_CCY";

	public final static String PROD = "products";
	public final static String SUB_PROD = "subProducts";
	public final static String PROD_DESC = "productsDesc";
	public final static String SUBPROD_DESC = "subProductsDesc";
	public final static String PROD_DESC_VAL = "productsDesc";
	public final static String SUB_PROD_DESC_VAL = "subProductsDesc";
	public final static String FUNC_CODE = "functionCode";

	public final static String MAKER_ID = "MAKER_ID";
	public final static String MAKER_DATE = "MAKER_DATE";
	public final static String AUTH_ID = "AUTH_ID";
	public final static String AUTH_DATE = "AUTH_DATE";
	public final static String APP_NAME = "APP_NAME";
	public final static String APP_ADD = "APP_ADD";
	public final static String APP_PHONE = "APP_PHONE";
	public final static String MAKER_NAME = "MAKER_NAME";
	public final static String AUTH_NAME = "AUTH_NAME";
	public final static String MAKER_LOGIN = "MAKER_LOGIN";
	public final static String AUTH_LOGIN = "AUTH_LOGIN";
	public final static String BANK_REF_NO = "BANK_REF_NO";
	public final static String BANK_VAL = "BANK_VAL";
	public final static String BANK_ADD1 = "BANK_ADD1";
	public final static String BANK_ADD2 = "BANK_ADD2";
	public final static String BANK_ADD3 = "BANK_ADD3";

	public final static String PRINT_POS_TOLERANCE = "PRINT_Tolerance";
	public final static String PRINT_MAKER_LOGIN = "PRINT_MAKER_LOGIN";
	public final static String PRINT_MAKER_NAME = "PRINT_MAKER_NAME";
	public final static String PRINT_AUTH_LOGIN = "PRINT_AUTH_LOGIN";
	public final static String PRINT_LC_PRODUCT = "PRINT_Prd";
	public final static String PRINT_REVOLVING = "PRINT_revolving";
	public final static String PRINT_TRANSFERABLE = "PRINT_transferable";
	public final static String PRINT_REVOKING = "PRINT_revoking";
	public final static String PRINT_AVAIL_WITH = "PRINT_AvbWith";
	public final static String PRINT_PAR_SHIP = "PRINT_par_ship";
	public final static String PRINT_TRANS_SHIP = "PRINT_trans_ship";

	public final static String PRINT_UN_GUARANTEE = "PRINT_Unlimited_guarentee";

	public final static String PRINT_LC_FLAG = "PRINT_LC_FLAG";

	public final static String PRINT_REQ_LOAN = "PRINT_REQ_LOAN";
	public final static String PRINT_INC_CHG_LOAN = "PRINT_INC_CHG_LOAN";

	public final static String[] YES_NO =
	{ "Y", "N", "" };
	public final static String[] YES_NO_VAL =
	{ "Yes", "No", "No" };
	public final static String[] REVOK_VAL =
	{ "Revocable", "Irrevocable", "Irrevocable" };
	public final static String[] SHIP_VAL =
	{ "Allowed", "Not Allowed", "Not Allowed" };
	public final static String[] GEN_SPEC =
	{ "G", "S" };
	public final static String[] AVAIL_VAL =
	{ "Generic", "Specific" };

	public final static String PGURANTEE_AMT = "PGURANTEE_AMT";
	public final static String ADVISING_THRU_BANK_CODE = "ADVISING_THRU_BANK_CODE";
	public final static String ADVISING_THRU_BANK_NAME = "ADVISE_BANKNAME";
	public final static String ADVISING_THRU_BANK_ADD = "ADVISE_BANKADDR";

	public final static String MULTI_REFERENCE_NO = "mtxnRefNo";
	public final static String TMPLT_NAME = JSPIOConstants.INPUT_TMPLT_NAME;
	public final static String TMPLT_TYPE = JSPIOConstants.INPUT_TMPLT_TYPE;
	public final static String TAKEDOWNCURR_ID = "TAKEDOWNCURR_ID";
	public final static String ENTP = "ENTP";
	public final static String TEMPLATE_UPDATE = "TEMPLATE_UPDATE";

	public final static String DEBIT_ACCOUNT_NO = "DEBIT_ACCOUNT_NO";
	public final static String SG_CURRENCY = "SG_CURRENCY";
	public final static String CHARGE_ACC_NO = "PROVISION_DB_ACC";
	public final static String CHARGE_TCURRENCY = "CHARGE_TCURRENCY";
	public final static String CARGO_NAME = "CARGO_NAME";
	public final static String VESSEL_NAME = "VESSEL_NAME";
	public final static String FLIGHT_NO = "FLIGHT_NO";
	public final static String COMPANY_ADDRESS = "COMPANY_ADDRESS";
	public final static String NO_OF_PACKAGES = "NO_OF_PACKAGES";
	public final static String GOODS_DESCP = "GOODS_DESCP";
	public final static String SHIP_NO = "SHIP_NO";
	public final static String SHIP_MARKS = "SHIP_MARKS";
	public final static String CONSIGNEE_NAME = "CONSIGNEE_NAME";
	public final static String CONSIGNEE_ADDRESS = "CONSIGNEE_ADDRESS";
	public final static String REINREASON = "REINREASON";
	public final static String SG_TYPE = "SG_TYPE";
	public final static String CIF_NO = "CIF_NO";
	public final static String BENE_ADDRESS_LINE1 = "BENE_ADDRESS_LINE1";
	public final static String BENE_ADDRESS_LINE2 = "BENE_ADDRESS_LINE2";
	public final static String TENOR_DAYS = "TENOR_DAYS";
	public final static String BILL_OF_LADING_AWB_DATE = "BILL_OF_LADING_AWB_DATE";
	public final static String REJECTED_DATE = "REJECTED_DATE";
	public final static String REJECTED_BY = "REJECTED_BY";
	public final static String REJECTED_REASON = "REASON_REJECT";
	public final static String CLAUSE_TG = "CLAUSE_TG";
	public final static String INPUT_FUNCTION_CODE = "INPUT_FUNCTION_CODE";
	public final static String REJECT_DATE = "REJECT_DATE";
	public final static String REMARKS = "REMARKS";
	public final static String CLAUSE_DI = "CLAUSE_DI";
	public final static String TXNCODE_LC_AMEND = "TXNCODE_LC_AMEND";
	public final static String TXNCODE_LC_ISS = "TXNCODE_LC_ISS";
	public final static String NEW_GUARANTEE_AMT = "NEW_GUARANTEE_AMT";
	public final static String BENE_COUNTRY = "BENE_COUNTRY";
	public final static String COUNTER_GUAR = "COUNTER_GUAR";
	public final static String CIF_NAME = "CIF_NAME";
	public final static String TRADE_GUARANTEE_EXPIRY = "TRADE_GUARANTEE_EXPIRY";
	public final static String LG_GUARANTEE_INCLUDED = "LG_GUARANTEE_INCLUDED";
	public final static String OTHERS = "OTHERS";
	public final static String BANK_DETAILS = "BANK_DETAILS";
	public final static String LG_REISSUED = "LG_REISSUED";
	public final static String REVOLVE_BY = "REVOLVE_BY";
	public final static String AUTO_REIN_STMT = "AUTO_REIN_STMT";
	public final static String CUMILATIVE = "CUMILATIVE";
	public final static String UNIT = "UNIT";
	public final static String FREQUENCY = "FREQUENCY";
	public final static String NEXT_REINST_DATE = "NEXT_REINST_DATE";
	public final static String LC_SIGHT_AMT = "LC_SIGHT_AMT";
	public final static String LC_USANCE_AMT = "LC_USANCE_AMT";
	public final static String TXNCODE_LG_AMEND = "TXNCODE_LG_AMEND";
	public final static String LC_PRODUCT_HOST = "LC_PRODUCT_HOST";
	public final static String LC_BENE_COUNTRY = "LC_BENE_COUNTRY";
	public final static String ADVISING_THRU_BANK_COUNTRY = "ADVISING_THRU_BANK_COUNTRY";
	public final static String SIGHT_ACC_NO = "SIGHT_ACC_NO";
	public final static String CHARGE_ACC_NAME = "CHARGE_ACC_NAME";
	public final static String AVAIL_BY_SIGHT = "AVAIL_BY_SIGHT";
	public final static String AVAIL_BY_USANCE = "AVAIL_BY_USANCE";
	public final static String TRAN_AIR = "TRAN_AIR";
	public final static String TRAN_SEA = "TRAN_SEA";
	public final static String TRAN_ROAD = "TRAN_ROAD";
	public final static String TARN_POSTAL = "TARN_POSTAL";
	public final static String TRAN_DELIVERY = "TRAN_DELIVERY";
	public final static String LGEFF_DATE = "LGEFF_DATE";
	public final static String COMPANYNUMBER = "COMPANYNUMBER";
	public final static String DOCUMENTNUMBER = "DOCUMENTNUMBER";
	public final static String OTHERDETAILS1 = "OTHERDETAILS1";
	public final static String OTHERDETAILS2 = "OTHERDETAILS2";
	public final static String OTHERDETAILS3 = "OTHERDETAILS3";
	public final static String CIF_NUMBER = "CIF_NUMBER";
	public final static String FIELD_RED_CLAUSE = "FIELD_RED_CLAUSE";
	public final static String STAND_BY = "STAND_BY";
	public final static String CONFIR_CHARGES = "CONFIR_CHARGES";
	public final static String CHARGES_OUTSIDE_CNTRY = "CHARGES_OUTSIDE_CNTRY";
	public final static String TRAN_MODE_TRUCK = "TRAN_MODE_TRUCK";
	public final static String TRAN_MODE_RAILWAY = "TRAN_MODE_RAILWAY";
	public final static String BRANCH_NAME = "BRANCH_NAME";
	public final static String AVAIL_WITH_BRANCH_NAME = "AVAIL_BANKNAME";
	public final static String SIGHT_TCURRENCY = "SIGHT_TCURRENCY";
	public final static String USANCE_TCURRENCY = "USANCE_TCURRENCY";
	public final static String TENOR_TERM = "TENOR_TERM";
	public final static String TENOR_DTL = "TENOR_DTL";
	public final static String USANCE_PERIOD = "USANCE_PERIOD";
	public final static String INCOTERMS = "INCO_TERMS";

	public final static String INS_COMP_NAME = "INSURANCE_COMPANY";
	public final static String INS_EXP_DATE = "INSURANCE_EXPIRY_DATE";
	public final static String INS_POLY_NUM = "INSURANCE_POLICY_NO";
	public final static String INS_CERTIFICATE = "INSURANCE_CERTIFICATE";
	public final static String LC_REFERENCE = "LC_REFERENCE";
	public final static String LC_SIGHT_AVAIL_AMT = "LC_SIGHT_AVAIL_AMT";
	public final static String LC_USANCE_AVAIL_AMT = "LC_USANCE_AVAIL_AMT";
	public final static String AMENDED_FIELDS = "AMENDED_FIELDS";
	public final static String DELIVERY_INSTR = "DELIVERY_INSTR";
	public final static String TXNCODE_LG_ISS = "TXNCODE_LG_ISS";
	public final static String TXNCODE_LC_CONFIRM = "TXNCODE_LC_CONFIRM";
	public final static String BANK_SPECIFIC = "BANK_SPECIFIC";
	public final static String BENE_ADD1 = "BENENAME_ADDR";
	public final static String BENE_ADD2 = "BENE_ADD2";
	public final static String BENE_ADD_DTLS = "BENE_ADD_DTLS";
	public final static String USANCE_ACC_NO = "USANCE_ACC_NO";
	public final static String BENECOUNTRY = "BENECOUNTRY";
	public final static String DOCSREQID = "DOCSREQID";
	public final static String GOODSID = "GOODSID";
	public final static String LCAMEND_GOODS_ID = "LCAMEND_GOODS_ID";
	public final static String LCAMEND_DOCS_ID = "LCAMEND_DOCS_ID";
	public final static String RED_CLAUSE = "RED_CLAUSE";
	public final static String STND_BY = "STND_BY";
	public final static String CONFIRM_CHARGE = "CONFIRM_CHARGE";
	public final static String OUTSIDE_COUNTRY_CHARGE = "OUTSIDE_COUNTRY_CHARGE";
	public final static String TRAN_RAILWAY = "TRAN_RAILWAY";
	public final static String TARN_TRUCK = "TARN_TRUCK";
	public final static String INPUT_PRODUCT = "INPUT_PRODUCT";
	public final static String INCASE_NEED = "IN_CASE_NEED";
	public final static String LIM_REASON = "LIM_REASON";
	public final static String MAX_CREDIT_AMT = "MAX_CREDIT_AMT";
	public final static String PLACE_DISPATCH = "PLACE_DISPATCH";
	public final static String PLACE_DESTINATION = "PLACE_DESTINATION";
	public final static String IMPLC_OBJ = "IMP_LC";
	public final static String SHPGRN_OBJ = "SHP_GRN";

}
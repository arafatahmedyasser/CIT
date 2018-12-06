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
package com.intellectdesign.canvas.web.config;

import java.io.Serializable;
import java.util.Map;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is a simple value object that contains the definition of an action map. An action map is a simple definition
 * that helps Canvas identify the target action class and the handler class for a particular action.
 * 
 * An action is defined as a combination of the following factors -
 * <ul>
 * <li><b>Product Code</b> - This is the broad level categorization of the functionality being enabled. This can also be
 * loosely correlated to the first level of hierarchy within the entitlement engine though it is not a mandate that this
 * should match the same</li>
 * <li><b>Sub product Code</b> - This is the second level categorization of the functionality being enabled. This can
 * also be loosely correlated to the second level of hierarchy within the entitlement engine though it is not a mandate
 * that this should match the same</li>
 * <li><b>Function code</b> - This is the functionality that is being operated upon. This can also be loosely correlated
 * to the function definition within the entitlement engine though it is not a mandate that this should match the same</li>
 * <li><b>Screen code</b> - This is the screen code that is associated for this functionality. This provides the
 * flexibility for the developers to fork out requests for the same functionality to different Action classes / handler
 * classes through a simple switch</li>
 * <li><b>Host code</b> - This is a code used for identifying the handler class for functionality. This is an optional
 * configuration that can be used for some kind of lookup in case the developer wants to segregate the definition of the
 * handler class from the action definition</li>
 * <li><b>Overridable</b> - This is a "true" or "false" flag that indicates whether a definition can be overridden. In
 * case a definition indicates that it cannot be overridden, then any duplicates faced at a later point in time will be
 * ignored with an appropriate warning. If it is set to true, then the order of loading the action map files into the
 * registry define the exact version of the map that will be used by the framework</li>
 * </ul>
 * 
 * For every combination of the above, the developer can indicate the following -
 * <ul>
 * <li><b>Action Class</b> - This is a mandatory input to be provided. If this is omitted, this is equivalent to a
 * missing configuration and will be skipped by Canvas</li>
 * <li><b>Handler Class</b> - This is an optional input. If this is provided, this is provided higher priority than the
 * Host code for identification of the handler class</li>
 * </ul>
 * 
 * There could be additional child elements that can be defined. All these will be loaded as additional Attributes at
 * the ActionMap level for implementing systems to use
 * 
 * A typical ActionMap configuration XML structure is provided below -
 * 
 * <pre>
 * {@code
 * <?xml version="1.0" ?>
 * 	<action-mapping>
 * 		<action-map screenCode="LOANS" prodCode="CUSER" subProdCode="CUSER" funcCode="VSBLTY" host="LOANSDTLS" canOverride="true" myanothercustomKey="myanothercustomvalue">
 * 			<action-class>com.orgname.product.MyActionClass</action-class>
 * 			<handler-class>com.orgname.product.MyHandlerClass</handler-class>
 * 			<myCustomKey>Dummy value</myCustomKey>
 * 		</action-map>
 * 	</action-mapping>
 * }
 * </pre>
 * 
 * @version 1.0
 */
public class ActionMap implements Serializable, ICanvasRegistryContent
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -1051690449974345385L;
	private String productCode;
	private String subProductCode;
	private String functionCode;
	private String screenCode;
	private String hostCode;
	private String actionClass;
	private String handlerClass;
	private boolean overridable;
	private Map<String, String> attributes;

	/**
	 * This is the attribute at the action map level that will provide the product code that will come as part of the
	 * request
	 */
	public static final String ATTRIB_PRODUCT_CODE = "prodCode";

	/**
	 * This is the attribute at the action map level that will provide the sub product code that will come as part of
	 * the request
	 */
	public static final String ATTRIB_SUBPROD_CODE = "subProdCode";

	/**
	 * This is the attribute at the action map level that will provide the function code that will come as part of the
	 * request
	 */
	public static final String ATTRIB_FUNCTION_CODE = "funcCode";

	/**
	 * This is the attribute at the action map level that will provide the screen code that will come as part of the
	 * request
	 */
	public static final String ATTRIB_SCREEN_CODE = "screenCode";

	/**
	 * This is the attribute at the action map level that will provide the host code to be attached to the request
	 */
	public static final String ATTRIB_HOST_CODE = "host";

	/**
	 * This is the attribute at the action map level that will indicate whether the map definition can be overridden or
	 * not
	 */
	public static final String ATTRIB_OVERRIDABLE = "canOverride";

	/**
	 * This is the child node of an action map that defines the actual action class that will handle this action
	 */
	public static final String ELEM_ACTION_CLASS = "action-class";

	/**
	 * This is the child node of an action map that defines the actual business handler for this action.
	 */
	public static final String ELEM_HANDLER_CLASS = "handler-class";

	/**
	 * This is the element name that corresponds to a single action map definition
	 */
	public static final String ELEM_ACTION_MAP = "action-map";

	/**
	 * This is the root element name within the action mapping XML file
	 */
	public static final String ELEM_ROOT_ACTION_MAP = "action-mapping";

	/**
	 * The only constructor for this class.
	 */
	protected ActionMap(ActionMapBuilder builder)
	{
		this.productCode = builder.getProductCode();
		this.subProductCode = builder.getSubProductCode();
		this.functionCode = builder.getFunctionCode();
		this.screenCode = builder.getScreenCode();
		this.hostCode = builder.getHostCode();
		this.overridable = builder.isOverridable();
		this.actionClass = builder.getActionClass();
		this.handlerClass = builder.getHandlerClass();

	}

	/**
	 * This is an implementatiion of the Comparable interface as required by the ICanvasRegistryContent
	 * 
	 * @param compareObj The object to be compared
	 * @return 0 if the object is same as current object. -1 otherwise
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	@Override
	public int compareTo(Object compareObj)
	{
		int returnVal = -1;
		if (compareObj instanceof ActionMap)
		{
			ActionMap compareVal = (ActionMap) compareObj;
			// An action map is deemed same only if the product, subproduct, function and screen code match
			String currentValData = new StringBuilder().append(productCode).append(subProductCode).append(functionCode)
					.append(screenCode).toString();
			String compareValData = new StringBuilder().append(compareVal.productCode)
					.append(compareVal.subProductCode).append(compareVal.functionCode).append(compareVal.screenCode)
					.toString();
			if (currentValData.equals(compareValData))
				returnVal = 0;
		}
		return returnVal;
	}

	/**
	 * Indicate whether this object can be overridden.
	 * 
	 * @return true if override is allowed. False otherwise
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent#isOverrideAllowed()
	 */
	@Override
	public boolean isOverrideAllowed()
	{
		return isOverridable();
	}

	/**
	 * ref to GetProductcode
	 * 
	 * @return the Product code
	 */
	public String getProductCode()
	{
		return productCode;
	}

	/**
	 * ref ton SunProductCode
	 * 
	 * @return the Sub Product Code
	 */
	public String getSubProductCode()
	{
		return subProductCode;
	}

	/**
	 * this method ref to GetFunctionCode
	 * 
	 * @return the Function Code
	 */
	public String getFunctionCode()
	{
		return functionCode;
	}

	/**
	 * this method ref to SetScreenCode
	 * 
	 * @return the Screen Code
	 */
	public String getScreenCode()
	{
		return screenCode;
	}

	/**
	 * this method ref to Hostcode
	 * 
	 * @return the Host Code
	 */
	public String getHostCode()
	{
		return hostCode;
	}

	/**
	 * this method ref to Overriden
	 * 
	 * @return Flag indicating whether the Map definition can be overridden
	 */
	public boolean isOverridable()
	{
		return overridable;
	}

	/**
	 * this method ref to ActionClass
	 * 
	 * @return the Action Class
	 */
	public String getActionClass()
	{
		return actionClass;
	}

	/**
	 * this method ref to Handler class
	 * 
	 * @return the Handler Class
	 */
	public String getHandlerClass()
	{
		return handlerClass;
	}

	/**
	 * this method ref to GetAttributeKey
	 * 
	 * @param attributeKey The key for which the configured value is to be fetched.
	 * @return the value for the specified key. If such an attribute was not present, then this will return null.
	 */
	public String getAttribute(String attributeKey)
	{
		return attributes.get(attributeKey);
	}

	/**
	 * This is the builder class for the ActionMap. The builder ensures that all mandatory attributes are set in the
	 * ActionMap before the Map can be created
	 * 
	 * @Version 1.0
	 */
	public static class ActionMapBuilder
	{
		private String productCode;
		private String subProductCode;
		private String functionCode;
		private String screenCode;
		private String hostCode;
		private String actionClass;
		private String handlerClass;
		private boolean overridable = true; // Set the default value for overridable to true
		private Map<String, String> attributes;

		/**
		 * This method adds any custom attribute that is provided as part of the ActionMap declaration that is used by
		 * specific implementations
		 * 
		 * @param attributeKey The attribute key. This will correspond to the key name in the XML converted to lower
		 *            case.
		 * @param attributeValue This is the value for that key in the XML.
		 * @return The reference to the builder itself for simple chained calling of the setters
		 */
		public ActionMapBuilder setAttribute(String attributeKey, String attributeValue)
		{
			if (!StringUtils.isEmpty(attributeKey))
			{
				attributes.put(attributeKey, attributeValue);
			}
			return this;
		}

		/**
		 * ref to ActionBuilderSetProductCode
		 * 
		 * @param prodCode the Product code for this Action Map
		 * @return the reference to the builder itself for simple chained calling of the setters
		 */
		public ActionMapBuilder setProductCode(String prodCode)
		{
			this.productCode = prodCode;
			return this;
		}

		/**
		 * 
		 * this method ref to ActionBuilder SetProduct
		 * 
		 * @param subProdCode the Sub Product Code to set
		 * @return the reference to the builder itself for simple chained calling of the setters
		 */
		public ActionMapBuilder setSubProductCode(String subProdCode)
		{
			this.subProductCode = subProdCode;
			return this;
		}

		/**
		 * this method ref to ActionBuildersetFunctionCode
		 * 
		 * @param funcCode the Function Code to set
		 * @return the reference to the builder itself for simple chained calling of the setters
		 */
		public ActionMapBuilder setFunctionCode(String funcCode)
		{
			this.functionCode = funcCode;
			return this;
		}

		/**
		 * this method ref to ActionBuilderSetScreenCode
		 * 
		 * @param scrCode the Screen Code to set
		 * @return the reference to the builder itself for simple chained calling of the setters
		 */
		public ActionMapBuilder setScreenCode(String scrCode)
		{
			this.screenCode = scrCode;
			return this;
		}

		/**
		 * this method ref to ActionBuilderSetHostCode
		 * 
		 * @param hstCode the Host Code to set in the ActionMap
		 * @return the reference to the builder itself for simple chained calling of the setters
		 */
		public ActionMapBuilder setHostCode(String hstCode)
		{
			this.hostCode = hstCode;
			return this;
		}

		/**
		 * this method ref to ActionBuilderActionClass
		 * 
		 * @param actionCls the action Class to set
		 * @return the reference to the builder itself for simple chained calling of the setters
		 */
		public ActionMapBuilder setActionClass(String actionCls)
		{
			this.actionClass = actionCls;
			return this;
		}

		/**
		 * this method ref to ActionBuilderSetHandlerClass
		 * 
		 * @param handlerCls the handler Class to set
		 * @return the reference to the builder itself for simple chained calling of the setters
		 */
		public ActionMapBuilder setHandlerClass(String handlerCls)
		{
			this.handlerClass = handlerCls;
			return this;
		}

		/**
		 * this method ref to ActionBuilder overridable
		 * 
		 * @param override Flag indicating whether this map definition can be overridden.
		 */
		public ActionMapBuilder setOverridable(boolean override)
		{
			this.overridable = override;
			return this;
		}

		/**
		 * this method ref to ActionBuilder SetOverridable
		 * 
		 * @param overrideVal String representation of the overridden flag
		 */
		public ActionMapBuilder setOverridable(String overrideVal)
		{
			if (!StringUtils.isEmpty(overrideVal))
				this.overridable = StringUtils.convertToBoolean(overrideVal);
			return this;
		}

		/**
		 * this method ref to ActionBuilder GetProductCode
		 * 
		 * @return the Product Code
		 */
		protected String getProductCode()
		{
			return productCode;
		}

		/**
		 * this method ref to ActionBuilderSubProductCode
		 * 
		 * @return the Sub Product Code
		 */
		protected String getSubProductCode()
		{
			return subProductCode;
		}

		/**
		 * this method ref to ActionBuilderFunctionCode
		 * 
		 * @return the Function Code
		 */
		protected String getFunctionCode()
		{
			return functionCode;
		}

		/**
		 * this method ref to SetScreenCode
		 * 
		 * @return the Screen Code
		 */
		protected String getScreenCode()
		{
			return screenCode;
		}

		/**
		 * this method ref to HostCode
		 * 
		 * @return the Host Code
		 */
		protected String getHostCode()
		{
			return hostCode;
		}

		/**
		 * this method ref to Actionclass
		 * 
		 * @return the Action Class
		 */
		protected String getActionClass()
		{
			return actionClass;
		}

		/**
		 * this method ref to GetHandlerClass
		 * 
		 * @return the Handler Class
		 */
		protected String getHandlerClass()
		{
			return handlerClass;
		}

		/**
		 * this method ref to Map
		 * 
		 * @return the Attributes to be set for the action map if applicable
		 */
		protected Map<String, String> getAttributes()
		{
			return attributes;
		}

		/**
		 * this method ref to Overridable
		 * 
		 * @return Flag indicating whether the Map definition can be overridden
		 */
		protected boolean isOverridable()
		{
			return overridable;
		}

		/**
		 * Builds the ActionMap based on the inputs and then returns the same
		 * 
		 * @return The constructed ActionMap
		 * @exception BaseException Thrown if any mandatory information is missing for the ActionMap
		 */
		public ActionMap build() throws BaseException
		{
			return new ActionMap(this);
		}
	}
}

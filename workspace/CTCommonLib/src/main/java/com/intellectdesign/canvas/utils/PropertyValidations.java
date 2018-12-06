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

package com.intellectdesign.canvas.utils;

import java.io.File;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.PropertyResourceBundle;

/**
 * This is an utility class to validate the configured properties of the bundle
 * 
 * @version 1.0
 */
public class PropertyValidations
{
	public PropertyValidations()
	{
	}

	/**
	 * This method validates a property is configured or not in the bundle
	 * 
	 * @param property
	 * @param bundle
	 * @return String
	 */
	public String validateConfig(String property, PropertyResourceBundle bundle)
	{

		String validationErrMsg = "";
		String prop = ResourceBundleUtils.getString(bundle, property, "");

		if (!bundle.containsKey(property))
		{
			validationErrMsg += "The property " + property + " is missing in the resource bundle.";
		} else if (StringUtils.isEmpty(prop))
		{
			validationErrMsg += "The value is not configured for the property " + property + " in the bundle. ";
		}

		return validationErrMsg;

	}

	/**
	 * This method validates an indicator is valid or not
	 * 
	 * @param indicator
	 * @param bundle
	 * @return String
	 */

	public String validateIndicators(String indicator, PropertyResourceBundle bundle)
	{
		String validationErrorMessage = "";
		ArrayList ind = new ArrayList();
		ind.add("YES");
		ind.add("NO");
		ind.add("Y");
		ind.add("N");
		ind.add("TRUE");
		ind.add("FALSE");
		ind.add("ON");
		ind.add("OFF");
		ind.add("0");
		ind.add("1");

		String prop = ResourceBundleUtils.getString(bundle, indicator, "-NA-");
		if ("-NA-".equals(prop))
			validationErrorMessage += indicator + " is missing. ";
		else if (StringUtils.isEmpty(prop))
			validationErrorMessage += indicator + " cannot have an empty configuration. ";
		else if (!ind.contains(prop.toUpperCase().trim()))
			validationErrorMessage += "The property '" + indicator
					+ "' accepts indicators as YES or NO, Y or N, true or false, 1 or 0, on or off only.";

		return validationErrorMessage;
	}

	/**
	 * This method validates a class configured is valid or not
	 * 
	 * @param property
	 * @param bundle
	 * @return String
	 */
	public String validateClass(String property, PropertyResourceBundle bundle)
	{

		String validationErrMsg = "";
		String prop = ResourceBundleUtils.getString(bundle, property, "");

		if (!bundle.containsKey(property))
		{
			validationErrMsg += "The property " + property + " is missing in the bundle .";
		} else if (StringUtils.isEmpty(prop))
		{
			validationErrMsg += "The value is not configured for the property " + property + " in the bundle " + ".";

		} else
		{
			try
			{
				Class.forName(prop.replace('/', '.').trim());
			} catch (ClassNotFoundException exception)
			{
				validationErrMsg += "The class " + prop + " configured for the property " + property + " is invalid.";
				return validationErrMsg;
			}
		}

		return validationErrMsg;

	}

	/**
	 * This method validates a Number configured is valid or not
	 * 
	 * @param property
	 * @param bundle
	 * @return String
	 */
	public String validateNumbers(String property, PropertyResourceBundle bundle)
	{
		String validationErrMsg = "";
		String prop = ResourceBundleUtils.getString(bundle, property, "");

		if (!bundle.containsKey(property))
		{
			validationErrMsg += "The property " + property + " is missing in the bundle .";
		} else if (StringUtils.isEmpty(prop))
		{
			validationErrMsg += "The value is not configured for the property " + property + " in the bundle. " + ".";
		} else if (!StringUtils.isNumber(prop.trim()))
		{
			validationErrMsg += "The property " + prop + " should be configured as number in the bundle.";

		} else if (Integer.parseInt(prop.trim()) < 0)
		{
			validationErrMsg += "The property " + prop + " has negative values.";
		}
		return validationErrMsg;
	}

	/**
	 * This method validates an alignment configured is valid or not
	 * 
	 * @param property
	 * @param bundle
	 * @return String
	 */

	public String validateAlignment(String property, PropertyResourceBundle bundle)
	{
		String validationErrMsg = "";
		String prop = ResourceBundleUtils.getString(bundle, property, "");
		ArrayList alignment = new ArrayList();
		alignment.add("LEFT");
		alignment.add("RIGHT");
		alignment.add("CENTER");
		if (!bundle.containsKey(property))
		{
			validationErrMsg += "The property " + property + " is missing in the bundle.";
		} else if (StringUtils.isEmpty(prop))
		{
			validationErrMsg += "The value is not configured for the property " + property + " in the bundle .";
		} else if (!(alignment.contains(prop.toUpperCase().trim())))
		{
			validationErrMsg += "The property " + prop + " should be configured as " + alignment.toString()
					+ " in the bundle .";

		}
		return validationErrMsg;
	}

	/**
	 * This method validates xml path configured is valid or not
	 * 
	 * @param webUtilURI
	 * @param bundle
	 * @return String
	 */

	public String validateXMLPath(String webUtilURI, PropertyResourceBundle bundle)
	{
		String validationErrorMessage = "";
		if (!bundle.containsKey(webUtilURI))
			validationErrorMessage += "The property " + webUtilURI + " is missing in the bundle.";
		else if (StringUtils.isEmpty(bundle.getString(webUtilURI)))
			validationErrorMessage += "The value is not configured for the property " + webUtilURI + " in the bundle.";
		else if (!StringUtils.contains(bundle.getString(webUtilURI), "xml"))
			validationErrorMessage += "The XML " + bundle.getString(webUtilURI) + " configured for the property "
					+ webUtilURI + " is not an XML file. ";

		return validationErrorMessage;
	}

	/**
	 * This method validates a path configured is valid or not
	 * 
	 * @param path
	 * @param bundle
	 * @return String
	 */

	public String validatePathConfig(String path, PropertyResourceBundle bundle, String rootPath)
	{
		String validationErrorMessage = "";
		File rbDefaultpath;
		if (!bundle.containsKey(path) || StringUtils.isEmpty(bundle.getString(path)))
			rbDefaultpath = new File(rootPath);
		else
			rbDefaultpath = new File(rootPath + bundle.getString(path).trim());
		if (!rbDefaultpath.exists())
		{
			if (!rbDefaultpath.mkdirs())
				validationErrorMessage += "The path " + rootPath + bundle.getString(path)
						+ " configured in the property " + path + " is invalid";
		}

		return validationErrorMessage;
	}

	/**
	 * This method validates a file is exists or not
	 * 
	 * @param path
	 * @param bundle
	 * @return String
	 */

	public String validateFileExists(String path, PropertyResourceBundle bundle, String rootPath)
	{
		String validationErrorMessage = "";
		if (!bundle.containsKey(path))
			validationErrorMessage += "The property " + path + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(path)))
			validationErrorMessage += "The value is not configured for the property " + path + " in the bundle .";
		else
		{
			File rbDefaultpath = new File(rootPath + bundle.getString(path).trim());
			if (!rbDefaultpath.exists())
			{
				validationErrorMessage += "The file " + rootPath + bundle.getString(path)
						+ " configured in the property " + path + " is invalid";
			}
		}

		return validationErrorMessage;
	}

	/**
	 * This method validates an URI is valid or not
	 * 
	 * @param uri
	 * @param bundle
	 * @return String
	 */
	@SuppressWarnings("unused")
	public String validateURI(String uri, PropertyResourceBundle bundle)
	{
		String validationErrorMessage = "";
		if (!bundle.containsKey(uri))
			validationErrorMessage += "The property " + uri + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(uri)))
			validationErrorMessage += "The value is not configured for the property " + uri + " in the bundle .";
		else
		{
			try
			{
				new URL(bundle.getString(uri).trim());
			} catch (Exception e1)
			{
				validationErrorMessage += "The URI " + bundle.getString(uri) + " configured in the property " + uri
						+ " is invalid";
				return validationErrorMessage;
			}

		}

		return validationErrorMessage;
	}

	/**
	 * This method validates the images formats configured is valid or not
	 * 
	 * @param format
	 * @param bundle
	 * @return String
	 */

	public String validateImageFormats(String format, PropertyResourceBundle bundle)
	{
		String formatArrays[] =
		{ "JPG", "JPEG", "TIFF", "JFIF", "PNG", "EXIF", "RAW", "GIF", "BMP", "PPM", "PGM", "PBM", "PNM", "WEBP",
				"RGBE", "CGM", "SVG" };
		ArrayList formatList = new ArrayList();
		formatList.addAll(Arrays.asList(formatArrays));

		String validationErrorMessage = "";

		if (!bundle.containsKey(format))
			validationErrorMessage += "The property " + format + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(format)))
			validationErrorMessage += "The value is not configured for the property " + format + " in the bundle .";
		else
		{
			String formatValues = bundle.getString(format).toUpperCase().trim();
			String[] eachFormat = formatValues.split(",");

			if (!formatList.containsAll(Arrays.asList(eachFormat)))
			{
				validationErrorMessage += "The formats " + bundle.getString(format) + " configured in the property "
						+ format + " is invalid. The following are the formats supported " + formatList.toString()
						+ ".";
			}

		}

		return validationErrorMessage;
	}

	/**
	 * This method validates the layout property
	 * 
	 * @param layout
	 * @param bundle
	 * @return String
	 */

	public String validateAppLayout(String layout, PropertyResourceBundle bundle)
	{

		String validationErrorMessage = "";
		/**
		 * The configured application layout type will not be validated as one of the existing FW default application
		 * layout types. Only the empty check will happen
		 */
		/*
		 * ArrayList layoutList = new ArrayList(); layoutList.add("CARD"); layoutList.add("EXCARD");
		 * layoutList.add("TAB"); layoutList.add("TABLE_TOP"); layoutList.add("APP"); layoutList.add("MENU");
		 */

		if (!bundle.containsKey(layout))
			validationErrorMessage += "The property " + layout + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(layout)))
			validationErrorMessage += "The value is not configured for the property " + layout + " in the bundle .";
		/*
		 * else if (!layoutList.contains(bundle.getString(layout).toUpperCase().trim())) { validationErrorMessage +=
		 * "The Layout " + bundle.getString(layout) + " configured in the property " + layout +
		 * " is invalid. The following are the Layout supported " + layoutList.toString() + ".";
		 * 
		 * }
		 */

		return validationErrorMessage;
	}

	/**
	 * This method validates the language code
	 * 
	 * @param code
	 * @param bundle
	 * @return String
	 */

	public String validateLangCode(String code, PropertyResourceBundle bundle)
	{

		String validationErrorMessage = "";

		if (!bundle.containsKey(code))
			validationErrorMessage += "The property " + code + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(code)))
			validationErrorMessage += "The value is not configured for the property " + code + " in the bundle .";
		else
		{
			String[] countryCodes = bundle.getString(code).trim().split(",");
			for (int count = 0; count < countryCodes.length; count++)
			{
				String[] langCode = countryCodes[count].trim().split("_");
				if (langCode.length != 2 || !(langCode[0].equals(langCode[0].toLowerCase()))
						|| !(langCode[1].equals(langCode[1].toUpperCase())))
				{
					validationErrorMessage += "The Language Country Code \"" + countryCodes[count].toString()
							+ "\" configured in the property " + code + " is invalid.";
				}
			}

		}
		return validationErrorMessage;
	}

	/**
	 * This method validates the currency properties
	 * 
	 * @param currency
	 * @param bundle
	 * @return String
	 */

	public String validateCurrency(String currency, PropertyResourceBundle bundle)
	{

		String validationErrorMessage = "";
		String[] currCode =
		{ "EUR", "VEF", "GBP", "USD", "EUR", "USD", "AED", "AUD", "ANG", "KWD", "JPY", "INR" };

		ArrayList currList = new ArrayList();
		currList.addAll(Arrays.asList(currCode));

		if (!bundle.containsKey(currency))
			validationErrorMessage += "The property " + currency + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(currency)))
			validationErrorMessage += "The value is not configured for the property " + currency + " in the bundle .";
		else
		{
			String[] currCodes = bundle.getString(currency).trim().split(",");

			if (!currList.containsAll(Arrays.asList(currCodes)))

			{
				validationErrorMessage += "The Currency Code "
						+ bundle.getString(currency)
						+ " configured in the property "
						+ currency
						+ " is invalid or it is not supported by Canvas Technology. The following are the currencies supported "
						+ currList.toString() + ".";

			}
		}

		return validationErrorMessage;
	}

	/**
	 * This method validates the size property
	 * 
	 * @param size
	 * @param bundle
	 * @return String
	 */
	public String validateSize(String size, PropertyResourceBundle bundle)
	{

		String validationErrorMessage = "";
		String[] sizeCode =
		{ "SMALL", "MEDIUM", "LARGE" };

		ArrayList sizeList = new ArrayList();
		sizeList.addAll(Arrays.asList(sizeCode));

		if (!bundle.containsKey(size))
			validationErrorMessage += "The property " + size + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(size)))
			validationErrorMessage += "The value is not configured for the property " + size + " in the bundle .";
		else if (!sizeList.contains(bundle.getString(size).toUpperCase().trim()))
		{
			validationErrorMessage += "The Size  " + bundle.getString(size) + " configured in the property " + size
					+ " is invalid or it is not supported by Canvas Technology. The following are the size supported "
					+ sizeList.toString() + ".";
		}
		return validationErrorMessage;
	}

	/**
	 * This method validates the default theme of the application
	 * 
	 * @param theme
	 * @param bundle
	 * @return String
	 */
	public String validateTheme(String theme, PropertyResourceBundle bundle)
	{

		String validationErrorMessage = "";
		String[] themeCode =
		{ "RED", "BLUE", "GREEN", "BLACK", "WHITE", "LIGHTBLUE", "GRAY", "ROYALBLUE", "CANVAS" };

		ArrayList themeList = new ArrayList();
		themeList.addAll(Arrays.asList(themeCode));

		if (!bundle.containsKey(theme))
			validationErrorMessage += "The property " + theme + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(theme)))
			validationErrorMessage += "The value is not configured for the property " + theme + " in the bundle .";
		else if (!themeList.contains(bundle.getString(theme).toUpperCase().trim()))
		{
			validationErrorMessage += "The theme  " + bundle.getString(theme) + " configured in the property " + theme
					+ " is invalid or it is not supported by Canvas Technology. The following are the Theme supported "
					+ themeList.toString() + ".";
		}
		return validationErrorMessage;
	}

	/**
	 * Validates that the provided class name is presnet and extends / implements the base class provided.
	 * 
	 * @param className
	 * @param baseOrInterfaceClassName
	 * @param configKey
	 * @param isMandatory
	 * @return String
	 */
	public String validateImplementationClass(String className, String baseOrInterfaceClassName, String configKey,
			boolean isMandatory)
	{
		String errorMsg = "";
		if (StringUtils.isEmpty(className))
		{
			if (isMandatory)
				errorMsg = configKey
						+ " is a mandatory configuration. Please provide a valid class which implements / extends from "
						+ baseOrInterfaceClassName;
		} else
		{
			try
			{
				Class subClass = Class.forName(className);
				Class baseClass = Class.forName(baseOrInterfaceClassName);
				if (!baseClass.isAssignableFrom(subClass))
				{
					errorMsg = "The class '" + className + "' configured for '" + configKey
							+ "' does not extend / implement '" + baseOrInterfaceClassName + "'";
				}
			} catch (Exception ex)
			{
				errorMsg = "The class '" + className + "' configured for '" + configKey
						+ "' cannot be loaded properly from class path. Is your classpath set correctly?";
			}
		}
		return errorMsg;
	}

	/**
	 * Validates whether user credentials has been provided properly
	 * 
	 * @param bundle
	 * @param userIdKey
	 * @param pwdKey
	 * @param isMandatory
	 * @return String
	 */
	public String validateUserCredentials(PropertyResourceBundle bundle, String userIdKey, String pwdKey,
			boolean isMandatory)
	{
		String userId = ResourceBundleUtils.getString(bundle, userIdKey, null);
		String password = ResourceBundleUtils.getString(bundle, pwdKey, null);
		String errorMsg = "";
		boolean userIdNotProvided = StringUtils.isEmpty(userId);
		boolean pwdNotProvided = StringUtils.isEmpty(password);
		boolean dataNotProvided = userIdNotProvided && pwdNotProvided;
		if (dataNotProvided)
		{
			if (isMandatory)
				errorMsg = "Mandatory Configuration is missing for '" + userIdKey + "' and '" + pwdKey + "'.";
		} else
		{
			if (userIdNotProvided && !pwdNotProvided)
				errorMsg = "Missing configuration for '" + userIdKey + "' when '" + pwdKey + "' has been provided";
			else if (!userIdNotProvided && pwdNotProvided)
				errorMsg = "Missing configuration for '" + pwdKey + "' when '" + userIdKey + "' has been provided";
		}

		return errorMsg;
	}

	/**
	 * Validate a column layout
	 * 
	 * @param layout
	 * @param bundle
	 * @return String
	 */

	public String validateColumnLayout(String layout, PropertyResourceBundle bundle)
	{

		String validationErrorMessage = "";
		ArrayList layoutList = new ArrayList();
		layoutList.add("STACK");
		layoutList.add("TWO-COLUMN");
		layoutList.add("THREE-COLUMN");

		if (!bundle.containsKey(layout))
			validationErrorMessage += "The property " + layout + " is missing in the bundle .";
		else if (StringUtils.isEmpty(bundle.getString(layout)))
			validationErrorMessage += "The value is not configured for the property " + layout + " in the bundle .";
		else
		{
			String layouts[] = bundle.getString(layout).toUpperCase().trim().split(",");
			if (!layoutList.containsAll(Arrays.asList(layouts)))
			{
				validationErrorMessage += "The Layout " + bundle.getString(layout) + " configured in the property "
						+ layout + " is invalid. The following are the Layout supported " + layoutList.toString() + ".";

			}
		}

		return validationErrorMessage;
	}

	/**
	 * This method validates the log level configuration property
	 * 
	 * @param propkey
	 * @param bundle
	 * @param isMandatory
	 * @return String
	 */
	public String validateLogLevelConfiguration(String propkey, PropertyResourceBundle bundle, boolean isMandatory)
	{
		String validationErrorMessage = "";
		String[] sizeCode =
		{ "info", "debug", "warn", "error", "fatal", "off" };

		ArrayList levelList = new ArrayList();
		levelList.addAll(Arrays.asList(sizeCode));

		String propValue = ResourceBundleUtils.getString(bundle, propkey, "");
		boolean propExists = !StringUtils.isEmpty(propValue);
		if (!propExists)
		{
			if (isMandatory)
			{
				validationErrorMessage += "The property '" + propkey
						+ "' has not been configured or is missing value in the bundle .";
			}
		} else
		{
			// So property exists. Check that it contains a valid value.
			if (!levelList.contains(propValue.toLowerCase()))
			{
				validationErrorMessage += "The Level provided  '"
						+ propValue
						+ "; configured for '"
						+ propkey
						+ "; is invalid or it is not supported by Canvas Technology. The following are the valid values supported "
						+ levelList.toString() + ".";
			}
		}

		return validationErrorMessage;
	}

	/**
	 * This is a helper method that validates whether the value for the given propKey is present in the list of valid
	 * values provided.
	 * 
	 * @param propKey
	 * @param bundle
	 * @param isMandatory
	 * @param validValues
	 * @param propDesc
	 * @return String
	 */
	public String validateListConfiguration(String propKey, PropertyResourceBundle bundle, boolean isMandatory,
			String[] validValues, boolean caseSensitive, String propDesc)
	{
		String validationErrorMessage = "";
		ArrayList valuesList = new ArrayList();
		if (caseSensitive)
		{
			for (String aVal : validValues)
				valuesList.add(aVal.toLowerCase());
		} else
			valuesList.addAll(Arrays.asList(validValues));

		String propValue = ResourceBundleUtils.getString(bundle, propKey, "");
		boolean propExists = !StringUtils.isEmpty(propValue);
		if (!propExists)
		{
			if (isMandatory)
			{
				validationErrorMessage += "The property '" + propKey
						+ "' has not been configured or is missing value in the bundle .";
			}
		} else
		{
			// So property exists. Check that it contains a valid value.
			String compareValue = caseSensitive ? propValue.toLowerCase() : propValue;
			if (!valuesList.contains(compareValue))
			{
				validationErrorMessage += "The "
						+ propDesc
						+ " provided  '"
						+ propValue
						+ " configured for '"
						+ propKey
						+ " is invalid or it is not supported by Canvas Technology. The following are the valid values supported "
						+ valuesList.toString() + ".";
			}
		}

		return validationErrorMessage;
	}

	/**
	 * ref to string validateDateFormatPattern
	 * 
	 * @param propKey
	 * @param bundle
	 * @param isMandatory
	 * @return String
	 */
	@SuppressWarnings("unused")
	public String validateDateFormatPattern(String propKey, PropertyResourceBundle bundle, boolean isMandatory)
	{
		String validationErrorMessage = "";
		String propValue = ResourceBundleUtils.getString(bundle, propKey, "");
		boolean propExists = !StringUtils.isEmpty(propValue);
		if (!propExists)
		{
			if (isMandatory)
			{
				validationErrorMessage += "The property '" + propKey
						+ "' has not been configured or is missing value in the bundle .";
			}
		} else
		{
			// So property exists. Check that it contains a valid value.
			try
			{
				SimpleDateFormat format = new SimpleDateFormat(propValue);
			} catch (IllegalArgumentException iae)
			{
				validationErrorMessage += "The value for '" + propKey + "' configured as '" + propValue
						+ " is not a valid date format.";
			}
		}

		return validationErrorMessage;
	}

	/**
	 * @param string
	 * @param bundle
	 * @return string This method is used to validate if the color palette is added in the bundle and if the added color
	 *         codes are valid.
	 */
	public String validateColorPalette(String colorPalette, PropertyResourceBundle bundle)
	{

		String validationErrorMessage = "";
		if (!bundle.containsKey(colorPalette))
		{
			validationErrorMessage += "The property " + colorPalette + " is missing in the bundle.";
		} else
		{
			String colorCodes[] = bundle.getString(colorPalette).toUpperCase().trim().split(",");
			List colorCodeList = new ArrayList();
			colorCodeList = Arrays.asList(colorCodes);
			String colorCode;
			ValidationUtility vu = new ValidationUtility();
			Iterator itr = colorCodeList.iterator();
			while (itr.hasNext())
			{
				colorCode = itr.next().toString().trim();
				if (!vu.validateHexColor(colorCode))
				{
					validationErrorMessage += "The Color Code " + colorCode + " configured in the property "
							+ colorPalette + " is invalid.";
				}
			}
		}
		return validationErrorMessage;
	}

	/**
	 * @param string
	 * @param bundle
	 * @return string This method is used to validate the values configured is between 0 to 6.
	 */
	public String validateWeekEnds(String sWeekEnds, PropertyResourceBundle bundle, boolean isMandatory)
	{
		String validationErrorMessage = "";
		if (!bundle.containsKey(sWeekEnds))
		{
			validationErrorMessage += "The property " + sWeekEnds + " is missing in the bundle.";
		} else
		{
			String arrWeekEnds[] = bundle.getString(sWeekEnds).trim().split(",");
			List listWeekEnds = new ArrayList();
			listWeekEnds = Arrays.asList(arrWeekEnds);
			String weekend;
			ValidationUtility vu = new ValidationUtility();
			Iterator itr = listWeekEnds.iterator();
			while (itr.hasNext())
			{
				weekend = itr.next().toString().trim();
				if (!vu.validWeekEnd(Integer.parseInt(weekend)))
				{
					validationErrorMessage += "The day " + weekend + " configured in the property " + sWeekEnds
							+ " is invalid.";
				}
			}
		}
		return validationErrorMessage;
	}

	/**
	 * This method validates a Number configured is valid or not
	 * 
	 * @param property
	 * @param bundle
	 * @return String
	 */
	public String validateExistence(String property, PropertyResourceBundle bundle)
	{
		String validationErrMsg = "";
		String prop = ResourceBundleUtils.getString(bundle, property, "");

		if (!bundle.containsKey(property))
		{
			validationErrMsg += "The property " + property + " is missing in the bundle .";
		} else if (StringUtils.isEmpty(prop))
		{
			validationErrMsg += "The value is not configured for the property " + property + " in the bundle. " + ".";
		}
		return validationErrMsg;
	}
}

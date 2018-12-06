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

package com.intellectdesign.canvas.deviceband;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;

/**
 * This object contains the details applicable for a Device band. The key aspects of a device band are -
 * <ul>
 * <li>Resolution (width x height): This helps identify the view port dimension available for the platform to render</li>
 * <li>Browser (family + version): This helps identify the environment available for the application to render</li>
 * <li>OS (vendor + version) : This helps identify the OS vendor and the version</li>
 * <li>Target Base Framework : This is the base framework that should be used for rendering for the above targets</li>
 * <li>Custom Attributes : Any additional attributes for which this device band should be matched</li>
 * </ul>
 * 
 * A sample code snippet creating the device band is - {@code DeviceBand aBand = new DeviceBand("M");
 * aBand.setResolutionInPixels( new int[] 480, 600} ); aBand.setBrowserFamily("Chrome");
 * aBand.setBrowserVersion("19.0"); aBand.setOsVendor("Windows"); aBand.setOsVersion("7.1"); aBand.setOverridable(true);
 * aBand.setDeviceCategory(DeviceCategory.MOBILE); aBand.setTargetFramework(TargetedFramework.JQUERY); //The framework
 * to use if this device band matches
 * 
 * DeviceBandRegistry.getInstance().register(aBand); }
 * 
 * @version 1.0
 */
public class DeviceBand implements ICanvasRegistryContent
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 885854205639936387L;

	private String name;
	private DeviceCategory deviceCategory;
	private int[] resolutionInPixels;
	private String browserFamily;
	private String browserVersion;
	private String osVendor;
	private String osVersion;
	private Map<String, String> attributeBag;
	private TargetedFramework targetFramework;
	private boolean overridable;

	/**
	 * The only constructor.
	 */
	public DeviceBand(String bandName)
	{
		this.name = bandName;
		attributeBag = new HashMap<String, String>();
	}

	/**
	 * @return the resolutionInPixels
	 */
	public int[] getResolutionInPixels()
	{
		return resolutionInPixels;
	}

	/**
	 * ref to setResolutionInPixels
	 * 
	 * @param resolutionInPixels the resolutionInPixels to set
	 */
	public void setResolutionInPixels(int[] resolutionInPixels)
	{
		this.resolutionInPixels = resolutionInPixels;
	}

	/**
	 * ref to getBrowserFamily
	 * 
	 * @return the browserFamily
	 */
	public String getBrowserFamily()
	{
		return browserFamily;
	}

	/**
	 * ref to SetBrowserFamily
	 * 
	 * @param browserFamily the browserFamily to set
	 */
	public void setBrowserFamily(String browserFamily)
	{
		this.browserFamily = browserFamily;
	}

	/**
	 * ref to getBrowserVersion
	 * 
	 * @return the browserVersion
	 */
	public String getBrowserVersion()
	{
		return browserVersion;
	}

	/**
	 * ref to getBrowserVersion
	 * 
	 * @param browserVersion the browserVersion to set
	 */
	public void setBrowserVersion(String browserVersion)
	{
		this.browserVersion = browserVersion;
	}

	/**
	 * ref to getOsVendor
	 * 
	 * @return the osVendor
	 */
	public String getOsVendor()
	{
		return osVendor;
	}

	/**
	 * ref too SetOsVendor
	 * 
	 * @param osVendor the osVendor to set
	 */
	public void setOsVendor(String osVendor)
	{
		this.osVendor = osVendor;
	}

	/**
	 * ref to getosVersion
	 * 
	 * @return the osVersion
	 */
	public String getOsVersion()
	{
		return osVersion;
	}

	/**
	 * ref to SetosVersion
	 * 
	 * @param osVersion the osVersion to set
	 */
	public void setOsVersion(String osVersion)
	{
		this.osVersion = osVersion;
	}

	/**
	 * ref to TargetedFramework
	 * 
	 * @return the targetFramework
	 */
	public TargetedFramework getTargetFramework()
	{
		return targetFramework;
	}

	/**
	 * ref to SetTargetedFramework
	 * 
	 * @param targetFramework the targetFramework to set
	 */
	public void setTargetFramework(TargetedFramework targetFramework)
	{
		this.targetFramework = targetFramework;
	}

	/**
	 * ref to deviceCategory
	 * 
	 * @return the deviceCategory
	 */
	public DeviceCategory getDeviceCategory()
	{
		return deviceCategory;
	}

	/**
	 * ref to SetdeviceCategory
	 * 
	 * @param deviceCategory the deviceCategory to set
	 */
	public void setDeviceCategory(DeviceCategory deviceCategory)
	{
		this.deviceCategory = deviceCategory;
	}

	/**
	 * ref to isoverridable
	 * 
	 * @return the overridable
	 */
	public boolean isOverridable()
	{
		return this.overridable;
	}

	/**
	 * ref to Setoverridable
	 * 
	 * @param override Flag indicating whether this map definition can be overridden.
	 */
	public void setOverridable(boolean override)
	{
		this.overridable = override;
	}

	/**
	 * ref to GetName
	 * 
	 * @return the name
	 */
	public String getName()
	{
		return name;
	}

	/**
	 * refto Device Setname
	 * 
	 * @param aName The name of this device band
	 */
	public void setName(String aName)
	{
		this.name = aName;
	}

	/**
	 * Set a custom attribute into this device band
	 * 
	 * @param attributeKey The key to be added
	 * @param attributeValue The value for the key. If the value is null, then this key will be removed from the custom
	 *            attributes
	 */
	public void setAttribute(String attributeKey, String attributeValue)
	{
		if (attributeValue == null)
			attributeBag.remove(attributeKey);
		else
			attributeBag.put(attributeKey, attributeValue);
	}

	/**
	 * Gets the value of the attribute from the bag. If not present, returns the default value
	 * 
	 * @param attributeKey The key to be retrieved
	 * @param defaultValue The default value to be returned if not present
	 * @return String
	 */
	public String getAttribute(String attributeKey, String defaultValue)
	{
		return attributeBag.containsKey(attributeKey) ? attributeBag.get(attributeKey) : defaultValue;
	}

	/**
	 * ref to compareT DeviceBand
	 * 
	 * @param compareObj
	 * @return int
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	@Override
	public int compareTo(Object compareObj)
	{
		int returnVal = -1;
		if (compareObj instanceof DeviceBand)
		{
			DeviceBand compareVal = (DeviceBand) compareObj;
			// An device band is deemed same only if all the input criteria matches
			// Note: The name is not considered as part of the business key. As it is only a logical name provided and
			// can be updated
			String currentValData = new StringBuilder().append(deviceCategory.getCode())
					.append(Arrays.toString(resolutionInPixels)).append(browserFamily).append(browserVersion)
					.append(osVendor).append(osVersion).toString();
			String compareValData = new StringBuilder().append(compareVal.deviceCategory.getCode())
					.append(Arrays.toString(compareVal.resolutionInPixels)).append(compareVal.browserFamily)
					.append(compareVal.browserVersion).append(compareVal.osVendor).append(compareVal.osVersion)
					.toString();
			if (currentValData.equals(compareValData))
				returnVal = 0;
		}
		return returnVal;
	}

	/**
	 * ref to isOverrideAllowed
	 * 
	 * @return isOverridable
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent#isOverrideAllowed()
	 */
	@Override
	public boolean isOverrideAllowed()
	{
		return isOverridable();
	}
}

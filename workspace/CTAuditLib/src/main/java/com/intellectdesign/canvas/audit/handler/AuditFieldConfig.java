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

package com.intellectdesign.canvas.audit.handler;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * This is an entity class for accessing the DB field values as object.
 *  
 * @version 1.0
 */
public class AuditFieldConfig implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 734204200876163388L;

	/***
	 * returns the fieldName. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return the fieldName
	 */
	public final String getFieldName()
	{
		return fieldName;
	}

	/***
	 * sets the fieldName. This method has been changed to final due to checkstyles issue fixing.This might be changed
	 * if any classes extends in future
	 * 
	 * @param sFieldName A {@code String}
	 */
	public final void setFieldName(final String sFieldName)
	{
		this.fieldName = sFieldName;
	}

	/***
	 * returns the requiredInd. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return boolean requiredInd
	 */
	public final boolean isRequiredInd()
	{
		return requiredInd;
	}

	/***
	 * sets the requiredInd. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @param bRequiredInd
	 */
	public final void setRequiredInd(final boolean bRequiredInd)
	{
		this.requiredInd = bRequiredInd;
	}

	/***
	 * returns the translationRequiredInd. This method has been changed to final due to checkstyles issue fixing.This
	 * might be changed if any classes extends in future
	 * 
	 * @return the isTranslationRequiredInd
	 */
	public final boolean isTranslationRequiredInd()
	{
		return isTranslationRequiredInd;
	}

	/***
	 * sets the translationRequiredInd. This method has been changed to final due to checkstyles issue fixing.This
	 * might be changed if any classes extends in future
	 * 
	 * @param translationRequiredInd
	 */
	public final void setTranslationRequiredInd(final boolean translationRequiredInd)
	{
		this.isTranslationRequiredInd = translationRequiredInd;
	}

	/***
	 * returns the labelPrefix. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return the labelPrefix
	 */
	public final String getLabelPrefix()
	{
		return labelPrefix;
	}

	/***
	 * sets the labelPrefix. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @param sLabelPrefix A {@code String}
	 */
	public final void setLabelPrefix(final String sLabelPrefix)
	{
		this.labelPrefix = sLabelPrefix;
	}

	/***
	 * returns the usedForDsa. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return the isUsedForDsa
	 */
	public final boolean isUsedForDsa()
	{
		return isUsedForDsa;
	}

	/***
	 * sets the usedForDsa. This method has been changed to final due to checkstyles issue fixing.This might be changed
	 * if any classes extends in future
	 * 
	 * @param bUsedForDsa setUsedForDsa
	 */
	public final void setUsedForDsa(final boolean bUsedForDsa)
	{
		this.isUsedForDsa = bUsedForDsa;
	}

	/***
	 * returns the specificResourceBundle of the field. This method has been changed to final due to checkstyles issue
	 * fixing.This might be changed if any classes extends in future
	 * 
	 * @return the fieldResourceBundle
	 */
	public final String getFieldResourceBundle()
	{
		return fieldResourceBundle;
	}

	/***
	 * sets the fieldResourceBundle. This method has been changed to final due to checkstyles issue fixing.This might
	 * be changed if any classes extends in future
	 * 
	 * @param sFieldResourceBundle A {@code String}
	 */
	public final void setFieldResourceBundle(final String sFieldResourceBundle)
	{
		this.fieldResourceBundle = sFieldResourceBundle;
	}

	/***
	 * returns the collectionInd. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return the collectionInd
	 */
	public final boolean isCollectionInd()
	{
		return collectionInd;
	}

	/***
	 * sets the collectionInd. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @param bCollectionInd setCollectionInd
	 */
	public final void setCollectionInd(final boolean bCollectionInd)
	{
		this.collectionInd = bCollectionInd;
		if (bCollectionInd)
			setChildren(new ArrayList<AuditFieldConfig>());
	}

	/***
	 * returns the collectionFieldReference. This method has been changed to final due to checkstyles issue fixing.This
	 * might be changed if any classes extends in future
	 * 
	 * @return collectionFieldReference
	 */
	public final String getCollectionFieldReference()
	{
		return collectionFieldReference;
	}

	/***
	 * returns the collectionFieldReference. This method has been changed to final due to checkstyles issue fixing.This
	 * might be changed if any classes extends in future
	 * 
	 * @param sCollectionFieldReference A {@code String}
	 */
	public final void setCollectionFieldReference(final String sCollectionFieldReference)
	{
		this.collectionFieldReference = sCollectionFieldReference;
	}

	/***
	 * returns the fieldLabel. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return fieldLabel
	 */
	public final String getFieldLabel()
	{
		return fieldLabel;
	}

	/***
	 * sets the fieldLabel. This method has been changed to final due to checkstyles issue fixing.This might be changed
	 * if any classes extends in future
	 * 
	 * @param sFieldLabel A {@code String}
	 */
	public final void setFieldLabel(final String sFieldLabel)
	{
		this.fieldLabel = sFieldLabel;
	}

	/***
	 * returns the countLabel. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @return countLabel
	 */
	public final String getCountLabel()
	{
		return countLabel;
	}

	/***
	 * sets the countLabel. This method has been changed to final due to checkstyles issue fixing.This might be changed
	 * if any classes extends in future
	 * 
	 * @param sCountLabel A {@code String}
	 */
	public final void setCountLabel(final String sCountLabel)
	{
		this.countLabel = sCountLabel;
	}

	/***
	 * returns the collectionLabel of a collection field. This method has been changed to final due to checkstyles
	 * issue fixing.This might be changed if any classes extends in future
	 * 
	 * @return collectionLabel
	 */
	public final String getCollectionLabel()
	{
		return collectionLabel;
	}

	/***
	 * sets the collectionLabel. This method has been changed to final due to checkstyles issue fixing.This might be
	 * changed if any classes extends in future
	 * 
	 * @param sCollectionLabel A {@code String}
	 */
	public final void setCollectionLabel(final String sCollectionLabel)
	{
		this.collectionLabel = sCollectionLabel;
	}

	/**
	 * Returns the list of child configuration within this item.
	 * 
	 * @return list of children
	 */
	public List<AuditFieldConfig> getChildren()
	{
		return this.children;
	}

	/**
	 * Sets the list of child configuration.
	 * 
	 * @param childList
	 */
	private void setChildren(List<AuditFieldConfig> childList)
	{
		this.children = childList;
	}

	/***
	 * returns the string representation. This method has been changed to final due to checkstyles issue fixing.This
	 * might be changed if any classes extends in future
	 * 
	 * @return string String representation of AuditFieldConfig
	 */
	@Override
	public final String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		sb.append("fieldName:");
		sb.append(fieldName);
		sb.append(", requiredInd:");
		sb.append(requiredInd);
		sb.append(", isTranslationRequiredInd:");
		sb.append(isTranslationRequiredInd);
		sb.append(", isUsedForDsa:");
		sb.append(isUsedForDsa);
		sb.append(", labelPrefix:");
		sb.append(labelPrefix);
		sb.append(", fieldResourceBundle:");
		sb.append(fieldResourceBundle);
		sb.append(", collectionInd:");
		sb.append(collectionInd);
		sb.append(", collectionFieldReference:");
		sb.append(collectionFieldReference);
		sb.append(", fieldLabel:");
		sb.append(fieldLabel);
		sb.append(", countLabel:");
		sb.append(countLabel);
		sb.append(", collectionLabel:");
		sb.append(collectionLabel);
		sb.append("}");
		return sb.toString();
	}

	private String fieldName = null;
	private boolean requiredInd = false;
	private boolean isTranslationRequiredInd = false;
	private boolean isUsedForDsa = false;
	private String labelPrefix = null;
	private String fieldResourceBundle = null;
	private boolean collectionInd = false;
	private String collectionFieldReference = null;
	private String fieldLabel = null;
	private String countLabel = null;
	private String collectionLabel = null;
	private List<AuditFieldConfig> children = null;

}

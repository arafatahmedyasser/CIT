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

package com.intellectdesign.canvas.spec;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * This object provides utility services around maintenance of list of listeners with options to add / remove listeners,
 * etc.
 * 
 * @version 1.0
 */
public class CanvasListenerList<T extends ICanvasListener>
{
	private List<T> listenerList = null;

	/**
	 * The default constructor for the listener list. This initializes the internal list object
	 */
	public CanvasListenerList()
	{
		listenerList = new ArrayList<T>();
	}

	/**
	 * This method will add the provided listener to the current list.
	 * 
	 * @param aListener The listener to be added
	 */
	public void addListener(T aListener)
	{
		listenerList.add(aListener);
	}

	/**
	 * This method will remove the provided listener from this list
	 * 
	 * @param aListener The listener to be removed
	 */
	public void removeListener(T aListener)
	{
		listenerList.remove(aListener);
	}

	/**
	 * This method can be used to check if a listener has been already added
	 * 
	 * @param aListener The listener to be checked against the existing list
	 * @return true, if the listener is already present. False otherwise.
	 */
	public boolean hasListener(T aListener)
	{
		return listenerList.contains(aListener);
	}

	/**
	 * This method returns an Iterator for iterating through all the listeners present in this list. In case the list is
	 * empty, the iterator will return false for the first invocation of hasNext().
	 * 
	 * @return The iterator for iterating through the list of listeners
	 */
	public Iterator<T> iterator()
	{
		return listenerList.iterator();
	}
}

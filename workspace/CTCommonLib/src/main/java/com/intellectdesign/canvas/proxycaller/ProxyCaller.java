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

package com.intellectdesign.canvas.proxycaller;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Proxy;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * A wrapper for an {@link Object} or {@link Class} upon which ProxyCallerive calls can be made. // Wrap an Object /
 * Class / class name with the on() method: on("java.lang.String") // Invoke constructors using the create() method:
 * .create("Hello World") // Invoke methods using the call() method: .call("toString") // Retrieve the wrapped object
 * 
 */
public class ProxyCaller
{

	/**
	 * Wrap a class name.
	 * <p>
	 * This is the same as calling <code>on(Class.forName(name))</code>
	 * 
	 * @param name A fully qualified class name
	 * @return A wrapped class object, to be used for further ProxyCallerion.
	 * @throws ProxyCallerException If any ProxyCallerion exception occurred.
	 * @see #on(Class)
	 */
	public static ProxyCaller on(String name) throws ProxyCallerException
	{
		return on(forName(name));
	}

	/**
	 * Wrap a class.
	 * <p>
	 * Use this when you want to access static fields and methods on a {@link Class} object, or as a basis for
	 * constructing objects of that class using {@link #create(Object...)}
	 * 
	 * @param clazz The class to be wrapped
	 * @return A wrapped class object, to be used for further ProxyCallerion.
	 */
	public static ProxyCaller on(Class<?> clazz)
	{
		return new ProxyCaller(clazz);
	}

	/**
	 * Wrap an object.
	 * <p>
	 * Use this when you want to access instance fields and methods on any {@link Object}
	 * 
	 * @param object The object to be wrapped
	 * @return A wrapped object, to be used for further ProxyCallerion.
	 */
	public static ProxyCaller on(Object object)
	{
		return new ProxyCaller(object);
	}

	/**
	 * The wrapped object
	 */
	final Object object;

	/**
	 * A flag indicating whether the wrapped object is a {@link Class} (for accessing static fields and methods), or any
	 * other type of {@link Object} (for accessing instance fields and methods).
	 */
	private final boolean isClass;

	/**
	 * ref to ProxyCaller
	 * 
	 * @param type
	 */
	private ProxyCaller(Class<?> type)
	{
		this.object = type;
		this.isClass = true;
	}

	/**
	 * ref to ProxyCaller
	 * 
	 * @param object
	 */
	private ProxyCaller(Object object)
	{
		this.object = object;
		this.isClass = false;
	}

	/**
	 * Get the wrapped object
	 * 
	 * @param <T> A convenience generic parameter for automatic unsafe casting
	 */
	@SuppressWarnings("unchecked")
	/**
	 * ref to object value
	 * 
	 * @return obj
	 */
	public <T> T get()
	{
		return (T) object;
	}

	/**
	 * Set a field value.
	 * <p>
	 * This is roughly equivalent to {@link Field#set(Object, Object)}. If the wrapped object is a {@link Class}, then
	 * this will set a value to a static member field. If the wrapped object is any other {@link Object}, then this
	 * will set a value to an instance member field.
	 * 
	 * @param name The field name
	 * @param value The new field value
	 * @return The same wrapped object, to be used for further ProxyCallerion.
	 * @throws ProxyCallerException If any ProxyCallerion exception occurred.
	 */
	public ProxyCaller set(String name, Object value) throws ProxyCallerException
	{
		try
		{

			// Try setting a public field
			Field field = type().getField(name);
			field.set(object, unwrap(value));
			return this;
		} catch (Exception e1)
		{
			boolean accessible = true;
			Field field = null;

			// Try again, setting a non-public field
			try
			{
				field = type().getDeclaredField(name);
				accessible = field.isAccessible();
				if (!accessible)
					field.setAccessible(true);

				field.set(object, unwrap(value));
				return this;
			} catch (Exception e2)
			{
				throw new ProxyCallerException(e2);
			} finally
			{
				if (field != null && !accessible)
				{
					field.setAccessible(false);
				}
			}
		}
	}

	/**
	 * Get a field value.
	 * <p>
	 * This is roughly equivalent to {@link Field#get(Object)}. If the wrapped object is a {@link Class}, then this
	 * will get a value from a static member field. If the wrapped object is any other {@link Object}, then this will
	 * get a value from an instance member field.
	 * <p>
	 * If you want to "navigate" to a wrapped version of the field, use {@link #field(String)} instead.
	 * 
	 * @param name The field name
	 * @return The field value
	 * @throws ProxyCallerException If any ProxyCallerion exception occurred.
	 * @see #field(String)
	 */
	public <T> T get(String name) throws ProxyCallerException
	{
		return field(name).<T> get();
	}

	/**
	 * Get a wrapped field.
	 * <p>
	 * This is roughly equivalent to {@link Field#get(Object)}. If the wrapped object is a {@link Class}, then this
	 * will wrap a static member field. If the wrapped object is any other {@link Object}, then this wrap an instance
	 * member field.
	 * 
	 * @param name The field name
	 * @return The wrapped field
	 * @throws ProxyCallerException If any ProxyCallerion exception occurred.
	 */
	public ProxyCaller field(String name) throws ProxyCallerException
	{
		try
		{

			// Try getting a public field
			Field field = type().getField(name);
			return on(field.get(object));
		} catch (Exception e1)
		{
			Field field = null;
			boolean accessible = true;

			// Try again, getting a non-public field
			try
			{
				field = type().getDeclaredField(name);
				accessible = field.isAccessible();

				if (!accessible)
					field.setAccessible(true);

				return on(field.get(object));
			} catch (Exception e2)
			{
				throw new ProxyCallerException(e2);
			} finally
			{
				if (field != null && !accessible)
				{
					field.setAccessible(false);
				}
			}
		}
	}

	/**
	 * Get a Map containing field names and wrapped values for the fields' values.
	 * <p>
	 * If the wrapped object is a {@link Class}, then this will return static fields. If the wrapped object is any
	 * other {@link Object}, then this will return instance fields.
	 * <p>
	 * These two calls are equivalent <code><pre>
	 * on(object).field(&quot;myField&quot;);
	 * on(object).fields().get(&quot;myField&quot;);
	 * </pre></code>
	 * 
	 * @return A map containing field names and wrapped values.
	 */
	public Map<String, ProxyCaller> fields()
	{
		Map<String, ProxyCaller> result = new LinkedHashMap<String, ProxyCaller>();

		for (Field field : type().getFields())
		{
			if (!isClass ^ Modifier.isStatic(field.getModifiers()))
			{
				String name = field.getName();
				result.put(name, field(name));
			}
		}

		return result;
	}

	/**
	 * Call a method by its name.
	 * <p>
	 * This is a convenience method for calling <code>call(name, new Object[0])</code>
	 * 
	 * @param name The method name
	 * @return The wrapped method result or the same wrapped object if the method returns <code>void</code>, to be
	 *         used for further ProxyCallerion.
	 * @throws ProxyCallerException If any ProxyCallerion exception occurred.
	 * @see #call(String, Object...)
	 */
	public ProxyCaller call(String name) throws ProxyCallerException
	{
		return call(name, new Object[0]);
	}

	/**
	 * Call a method by its name.
	 * <p>
	 * This is roughly equivalent to {@link Method#invoke(Object, Object...)}. If the wrapped object is a {@link Class},
	 * then this will invoke a static method. If the wrapped object is any other {@link Object}, then this will invoke
	 * an instance method.
	 * <p>
	 * Just like {@link Method#invoke(Object, Object...)}, this will try to wrap primitive types or unwrap primitive
	 * type wrappers if applicable. If several methods are applicable, by that rule, the first one encountered is
	 * called. i.e. when calling <code><pre>
	 * on(...).call(&quot;method&quot;, 1, 1);
	 * </pre></code> The first of the following methods will be called: <code><pre>
	 * public void method(int param1, Integer param2);
	 * 
	 * public void method(Integer param1, int param2);
	 * 
	 * public void method(Number param1, Number param2);
	 * 
	 * public void method(Number param1, Object param2);
	 * 
	 * public void method(int param1, Object param2);
	 * </pre></code>
	 * 
	 * @param name The method name
	 * @param args The method arguments
	 * @return The wrapped method result or the same wrapped object if the method returns <code>void</code>, to be
	 *         used for further ProxyCallerion.
	 * @throws ProxyCallerException If any ProxyCallerion exception occurred.
	 */
	public ProxyCaller call(String name, Object... args) throws ProxyCallerException
	{
		Class<?>[] types = types(args);

		// Try invoking the "canonical" method, i.e. the one with exact
		// matching argument types
		try
		{
			Method method = type().getMethod(name, types);
			return on(method, object, args);
		}

		// If there is no exact match, try to find one that has a "similar"
		// signature if primitive argument types are converted to their wrappers
		catch (NoSuchMethodException e)
		{
			for (Method method : type().getMethods())
			{
				if (method.getName().equals(name) && match(method.getParameterTypes(), types))
				{
					return on(method, object, args);
				}
			}

			throw new ProxyCallerException(e);
		}
	}

	/**
	 * Call a constructor.
	 * <p>
	 * This is a convenience method for calling <code>create(new Object[0])</code>
	 * 
	 * @return The wrapped new object, to be used for further ProxyCallerion.
	 * @throws ProxyCallerException If any ProxyCallerion exception occurred.
	 * @see #create(Object...)
	 */
	public ProxyCaller create() throws ProxyCallerException
	{
		return create(new Object[0]);
	}

	/**
	 * Call a constructor.
	 * <p>
	 * This is roughly equivalent to {@link Constructor#newInstance(Object...)}. If the wrapped object is a
	 * {@link Class}, then this will create a new object of that class. If the wrapped object is any other
	 * {@link Object}, then this will create a new object of the same type.
	 * <p>
	 * Just like {@link Constructor#newInstance(Object...)}, this will try to wrap primitive types or unwrap primitive
	 * type wrappers if applicable. If several constructors are applicable, by that rule, the first one encountered is
	 * called. i.e. when calling <code><pre>
	 * on(C.class).create(1, 1);
	 * </pre></code> The first of the following constructors will be applied: <code><pre>
	 * public C(int param1, Integer param2);
	 * public C(Integer param1, int param2);
	 * public C(Number param1, Number param2);
	 * public C(Number param1, Object param2);
	 * public C(int param1, Object param2);
	 * </pre></code>
	 * 
	 * @param args The constructor arguments
	 * @return The wrapped new object, to be used for further ProxyCallerion.
	 * @throws ProxyCallerException If any ProxyCallerion exception occurred.
	 */
	public ProxyCaller create(Object... args) throws ProxyCallerException
	{
		Class<?>[] types = types(args);

		// Try invoking the "canonical" constructor, i.e. the one with exact
		// matching argument types
		try
		{
			Constructor<?> constructor = type().getConstructor(types);
			return on(constructor, args);
		}

		// If there is no exact match, try to find one that has a "similar"
		// signature if primitive argument types are converted to their wrappers
		catch (NoSuchMethodException e)
		{
			for (Constructor<?> constructor : type().getConstructors())
			{
				if (match(constructor.getParameterTypes(), types))
				{
					return on(constructor, args);
				}
			}

			throw new ProxyCallerException(e);
		}
	}

	/**
	 * Create a proxy for the wrapped object allowing to typesafely invoke methods on it using a custom interface
	 * 
	 * @param proxyType The interface type that is implemented by the proxy
	 * @return A proxy for the wrapped object
	 */
	@SuppressWarnings("unchecked")
	public <P> P as(Class<P> proxyType)
	{
		final InvocationHandler handler = new InvocationHandler()
		{
			@Override
			public Object invoke(Object proxy, Method method, Object[] args) throws Throwable
			{
				return on(object).call(method.getName(), args).get();
			}
		};

		return (P) Proxy.newProxyInstance(proxyType.getClassLoader(), new Class[]
		{ proxyType }, handler);
	}

	/**
	 * Check whether two arrays of types match, converting primitive types to their corresponding wrappers.
	 * 
	 * @param declaredTypes
	 * @param actualTypes
	 * @return boolean true if both the parameters match
	 */
	private boolean match(Class<?>[] declaredTypes, Class<?>[] actualTypes)
	{
		if (declaredTypes.length == actualTypes.length)
		{
			for (int i = 0; i < actualTypes.length; i++)
			{
				if (!wrapper(declaredTypes[i]).isAssignableFrom(wrapper(actualTypes[i])))
				{
					return false;
				}
			}

			return true;
		}
		return false;
	}

	/**
	 * method ref to hashcode {@inheritDoc}
	 * 
	 * @return obj
	 */
	@Override
	public int hashCode()
	{
		return object.hashCode();
	}

	/**
	 * ref to Boolean equal obj {@inheritDoc}
	 * 
	 * @return obj
	 */
	@Override
	public boolean equals(Object obj)
	{
		if (obj instanceof ProxyCaller)
		{
			return object.equals(((ProxyCaller) obj).get());
		}

		return false;
	}

	/**
	 * ref to Str to values
	 * 
	 * @return obj {@inheritDoc}
	 * @return toStr
	 */
	@Override
	public String toString()
	{
		return object.toString();
	}

	/**
	 * Wrap an object created from a constructor
	 */
	private static ProxyCaller on(Constructor<?> constructor, Object... args) throws ProxyCallerException
	{
		try
		{
			return on(constructor.newInstance(args));
		} catch (Exception e)
		{
			throw new ProxyCallerException(e);
		}
	}

	/**
	 * Wrap an object returned from a method
	 */
	private static ProxyCaller on(Method method, Object object, Object... args) throws ProxyCallerException
	{
		boolean accessible = method.isAccessible();

		try
		{
			if (!accessible)
				method.setAccessible(true);

			if (method.getReturnType() == void.class)
			{
				method.invoke(object, args);
				return on(object);
			}
			return on(method.invoke(object, args));
		} catch (Exception e)
		{
			throw new ProxyCallerException(e);
		} finally
		{
			if (!accessible)
			{
				method.setAccessible(false);
			}
		}
	}

	/**
	 * Unwrap an object
	 * 
	 * @return obj
	 */
	private static Object unwrap(Object object)
	{
		if (object instanceof ProxyCaller)
		{
			return ((ProxyCaller) object).get();
		}

		return object;
	}

	/**
	 * Get an array of types for an array of objects
	 * 
	 * @return class
	 * @see Object#getClass()
	 */
	private static Class<?>[] types(Object... values)
	{
		if (values == null)
		{
			return new Class[0];
		}

		Class<?>[] result = new Class[values.length];

		for (int i = 0; i < values.length; i++)
		{
			result[i] = values[i].getClass();
		}

		return result;
	}

	/**
	 * Load a class
	 * 
	 * @exception ProxyCallerException
	 * @see Class#forName(String)
	 */
	private static Class<?> forName(String name) throws ProxyCallerException
	{
		try
		{
			return Class.forName(name);
		} catch (Exception e)
		{
			throw new ProxyCallerException(e);
		}
	}

	/**
	 * Get the type of the wrapped object.
	 * 
	 * @see Object#getClass()
	 */
	public Class<?> type()
	{
		if (isClass)
		{
			return (Class<?>) object;
		}
		return object.getClass();
	}

	/**
	 * Get a wrapper type for a primitive type, or the argument type itself, if it is not a primitive type.
	 * 
	 * @return type
	 */
	private static Class<?> wrapper(Class<?> type)
	{
		if (boolean.class == type)
		{
			return Boolean.class;
		} else if (int.class == type)
		{
			return Integer.class;
		} else if (long.class == type)
		{
			return Long.class;
		} else if (short.class == type)
		{
			return Short.class;
		} else if (byte.class == type)
		{
			return Byte.class;
		} else if (double.class == type)
		{
			return Double.class;
		} else if (float.class == type)
		{
			return Float.class;
		} else if (char.class == type)
		{
			return Character.class;
		} else
		{
			return type;
		}
	}

}

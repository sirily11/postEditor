import React, { useState, useEffect } from 'react';
import { Result, Post } from '../interfaces';
import { getURL } from '../../setting/settings';
import axios from 'axios';

/**
 * Search post by key word
 * @param keyword Search Keyword
 */
export async function searchPost(keyword: string): Promise<Result<Post>> {
    let url = getURL("post/?search=" + encodeURIComponent(keyword));
    let result = await axios.get<Result<Post>>(url);
    return result.data
}

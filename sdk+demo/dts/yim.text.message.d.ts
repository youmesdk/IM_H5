/**
 * @fileOverview 文本消息
 * @author benz@youme.im
 * @date 2018/6/28
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import YIM from 'youme-im/core';
export default class TextMessage extends YIM.Message {
    /**
     * 可直接新建一个文本消息对象
     * @param {string} text
     */
    constructor(text?: string);

    /**
     * 设置文本
     * @param {string} text
     */
    public setText(text: string): void;

    /**
     * 取得文本
     * @return {string}
     */
    public getText(): string;

    protected typeId: number;
    protected typeName: string;
    public initWithContent(content: string): Promise<void>;

    /**
     * 按事先设置的脏字数组
     * @param {string} text 原始消息
     * @param {string='**'} replace 脏字替换字，默认为 '**'
     */
    public static filterDirty(text: string, replace?: string): string;

    /**
     * 设置过滤脏字，若传入 null 则取消过滤
     * @param {string[] | null} wordsArray
     */
    public static setDirtyWords(wordsArray: string[] | null): void;
}

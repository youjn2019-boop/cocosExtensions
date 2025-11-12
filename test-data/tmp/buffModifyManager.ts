
import { buffModify, buffModifyArray } from "./buffModify";
import { tableManager } from "./tableManager";

export class buffModifyManager extends tableManager {

    mItemArray: buffModifyArray;
	/// <summary>
	/// give the key(s) to get item.
	/// </summary>
	/// <param name="id">编号</param> 
    GetItem(id: number): buffModify {
		var key = id; //((id) << 0)
		var index = this.search(key);
		return -1 === index ? null : this.mItemArray.Items[index];
    }
	
	GetAllItem(): buffModifyArray {
		return this.mItemArray;
	}

    protected getTableKeys(): Array<number> {
        return this.mItemArray.Keys;
    }
}

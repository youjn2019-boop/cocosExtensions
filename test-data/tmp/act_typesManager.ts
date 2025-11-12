
import { act_types, act_typesArray } from "./act_types";
import { tableManager } from "./tableManager";

export class act_typesManager extends tableManager {

    mItemArray: act_typesArray;
	/// <summary>
	/// give the key(s) to get item.
	/// </summary>
	/// <param name="id">系统ID</param> 
    GetItem(id: number): act_types {
		var key = id; //((id) << 0)
		var index = this.search(key);
		return -1 === index ? null : this.mItemArray.Items[index];
    }
	
	GetAllItem(): act_typesArray {
		return this.mItemArray;
	}

    protected getTableKeys(): Array<number> {
        return this.mItemArray.Keys;
    }
}

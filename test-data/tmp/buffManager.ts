
import { buff, buffArray } from "./buff";
import { tableManager } from "./tableManager";

export class buffManager extends tableManager {

    mItemArray: buffArray;
	/// <summary>
	/// give the key(s) to get item.
	/// </summary>
	/// <param name="id">编号</param> 
    GetItem(id: number): buff {
		var key = id; //((id) << 0)
		var index = this.search(key);
		return -1 === index ? null : this.mItemArray.Items[index];
    }
	
	GetAllItem(): buffArray {
		return this.mItemArray;
	}

    protected getTableKeys(): Array<number> {
        return this.mItemArray.Keys;
    }
}

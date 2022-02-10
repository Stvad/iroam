import { invertTree, mergeTreesByUid } from "../helpers";

/* test("proper tree parsing", () => {
    var testTree1NotInverted = {
        uid: "C",
        order: 0,
        _children: [{
            uid: "B",
            order: 0,
            _children: [{
                uid: "A",
                order: 3,
                _children: ["uglamugla"]
            }]
        }]
    };

    var testTree1Inverted = {
        uid: "A",
        order: 3,
        _children: ["uglamugla"],
        children: [{
            uid: "B",
            order: 0,
            _children: [{
                uid: "A",
                order: 3,
                _children: ["uglamugla"]
            }],
            children: [{
                uid: "C",
                order: 0,
                _children: [{
                    uid: "B",
                    order: 0,
                    _children: [{
                        uid: "A",
                        order: 3,
                        _children: ["uglamugla"]
                    }]
                }]
            }]
        }]
    }
    console.log(invertTree(testTree1NotInverted, "A"))
    expect(invertTree(testTree1NotInverted, "A")).toEqual(testTree1Inverted)

    var testTree2 = {
        uid: "A",
        order: 3,
        children: [{
            uid: "D",
            order: 1
        }]
    }

    var testTree = {
        uid: "A",
        order: 3,
        _children: ["uglamugla"],
        children: [{
            uid: "B",
            order: 0,
            _children: [{
                uid: "A",
                order: 3,
                _children: ["uglamugla"]
            }],
            children: [{
                uid: "C",
                order: 0,
                _children: [{
                    uid: "B",
                    order: 0,
                    _children: [{
                        uid: "A",
                        order: 3,
                        _children: ["uglamugla"]
                    }]
                }]
            }]
        },
        {
            uid: "D",
            order: 1
        }]
    }
    expect(mergeTreesByUid([testTree1Inverted, testTree2])).toEqual(testTree)
}); */

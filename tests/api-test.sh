#!/bin/bash
# 未来人才网 - API 接口测试脚本

echo "=========================================="
echo "  未来人才网 - API 接口测试"
echo "=========================================="
echo ""

API_URL="http://localhost:8081/api"
PASS=0
FAIL=0

# 测试函数
test_api() {
  local name=$1
  local url=$2
  local expected_code=$3
  
  echo -n "测试：$name ... "
  
  response=$(curl -s -w "\n%{http_code}" "$url")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" = "200" ]; then
    code=$(echo "$body" | grep -o '"code":[0-9]*' | cut -d':' -f2)
    if [ "$code" = "$expected_code" ]; then
      echo "✅ PASS"
      ((PASS++))
    else
      echo "❌ FAIL (code=$code, expected=$expected_code)"
      ((FAIL++))
      echo "   Response: $body"
    fi
  else
    echo "❌ FAIL (HTTP $http_code)"
    ((FAIL++))
  fi
}

# ============ 基础接口测试 ============
echo "--- 基础接口测试 ---"
test_api "GET /api/ideas (想法列表)" "$API_URL/ideas" "0"
test_api "GET /api/users/stats (统计数据)" "$API_URL/users/stats" "0"
test_api "GET /api/users/tags/hot (热门标签)" "$API_URL/users/tags/hot" "0"

# ============ 想法相关测试 ============
echo ""
echo "--- 想法相关测试 ---"
test_api "GET /api/ideas?page=1 (分页)" "$API_URL/ideas?page=1&pageSize=10" "0"
test_api "GET /api/ideas?sort=hot (热门排序)" "$API_URL/ideas?sort=hot" "0"
test_api "GET /api/ideas?sort=latest (最新排序)" "$API_URL/ideas?sort=latest" "0"
test_api "GET /api/ideas?keyword=AI (关键词搜索)" "$API_URL/ideas?keyword=AI" "0"
test_api "GET /api/ideas?tag=AI (标签筛选)" "$API_URL/ideas?tag=AI" "0"

# ============ 用户相关测试 ============
echo ""
echo "--- 用户相关测试 ---"
test_api "GET /api/users/1 (用户信息)" "$API_URL/users/1" "0"
test_api "GET /api/users/1/ideas (用户想法)" "$API_URL/users/1/ideas" "0"
test_api "GET /api/users/999 (不存在的用户)" "$API_URL/users/999" "0"

# ============ 边界测试 ============
echo ""
echo "--- 边界测试 ---"
test_api "GET /api/ideas?page=999 (超大页码)" "$API_URL/ideas?page=999" "0"
test_api "GET /api/ideas?keyword=xyz123notexist (无结果搜索)" "$API_URL/ideas?keyword=xyz123notexist" "0"

# ============ 性能测试 ============
echo ""
echo "--- 性能测试 ---"
echo -n "测试：/api/ideas 响应时间 ... "
start=$(date +%s%N)
curl -s "$API_URL/ideas" > /dev/null
end=$(date +%s%N)
duration=$(( (end - start) / 1000000 ))
if [ $duration -lt 3000 ]; then
  echo "✅ PASS (${duration}ms)"
  ((PASS++))
else
  echo "❌ FAIL (${duration}ms > 3000ms)"
  ((FAIL++))
fi

echo -n "测试：/api/users/stats 响应时间 ... "
start=$(date +%s%N)
curl -s "$API_URL/users/stats" > /dev/null
end=$(date +%s%N)
duration=$(( (end - start) / 1000000 ))
if [ $duration -lt 3000 ]; then
  echo "✅ PASS (${duration}ms)"
  ((PASS++))
else
  echo "❌ FAIL (${duration}ms > 3000ms)"
  ((FAIL++))
fi

# ============ 测试结果汇总 ============
echo ""
echo "=========================================="
echo "  测试结果汇总"
echo "=========================================="
echo "✅ 通过：$PASS"
echo "❌ 失败：$FAIL"
echo "总计：$((PASS + FAIL))"
echo "=========================================="

if [ $FAIL -gt 0 ]; then
  exit 1
else
  exit 0
fi
